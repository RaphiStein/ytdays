import { IStructuredD3Block } from "./types";

/**
 * Animations use the Web Animations API rather than d3 transitions so every SVG
 * attribute is written at its final value synchronously; the animations only
 * layer a temporary visual offset on top.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const DURATION = 450;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const STAGGER = 60;
const MAX_STAGGER_STEPS = 10;

interface BarSnapshot {
  x: number;
  /** y relative to its year group */
  y: number;
  /** y relative to the chart container */
  absY: number;
  width: number;
  height: number;
  rx: number;
  fill: string;
  photoFill: string | null;
}

interface LabelSnapshot {
  x: number;
  /** y relative to its year group */
  y: number;
  text: string;
}

export interface ChartSnapshot {
  height: number;
  groupY: Map<string, number>;
  labels: Map<string, LabelSnapshot>;
  bandHeight: Map<string, number>;
  bars: Map<string, BarSnapshot>;
}

export function barKey(d: IStructuredD3Block): string {
  return `${d.year}-${d.yomTov}-${d.subYomTov}`;
}

function num(el: Element, attr: string): number {
  return parseFloat(el.getAttribute(attr) || "0") || 0;
}

function translateY(el: Element): number {
  const match = /translate\(\s*[-\d.]+\s*,\s*([-\d.]+)/.exec(
    el.getAttribute("transform") || ""
  );
  return match ? parseFloat(match[1]) : 0;
}

function yearGroups(container: Element): SVGGElement[] {
  return Array.from(container.children).filter(
    (el) => el.tagName.toLowerCase() === "g" && el.id.indexOf("year-") === 0
  ) as SVGGElement[];
}

function canAnimate(): boolean {
  if (typeof Element.prototype.animate !== "function") return false;
  return !(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function timing(overrides: KeyframeAnimationOptions = {}) {
  return { duration: DURATION, easing: EASING, ...overrides };
}

/** Capture where everything currently sits, before draw() tears the chart down */
export function snapshotChart(): ChartSnapshot | null {
  const svg = document.querySelector("#calendar-area > svg");
  const container = svg && svg.querySelector("#container");
  if (!svg || !container || !canAnimate()) return null;

  const snapshot: ChartSnapshot = {
    height: num(svg, "height"),
    groupY: new Map(),
    labels: new Map(),
    bandHeight: new Map(),
    bars: new Map(),
  };

  yearGroups(container).forEach((group) => {
    const groupY = translateY(group);
    snapshot.groupY.set(group.id, groupY);

    const label = group.querySelector("text.year-label");
    if (label) {
      snapshot.labels.set(group.id, {
        x: num(label, "x"),
        y: num(label, "y"),
        text: label.textContent || "",
      });
    }
    const band = group.querySelector("rect.current-year-band");
    if (band) snapshot.bandHeight.set(group.id, num(band, "height"));

    group.querySelectorAll<SVGRectElement>("rect.bar").forEach((bar) => {
      snapshot.bars.set(barKey((bar as any).__data__), {
        x: num(bar, "x"),
        y: num(bar, "y"),
        absY: groupY + num(bar, "y"),
        width: num(bar, "width"),
        height: num(bar, "height"),
        rx: num(bar, "rx"),
        fill: bar.style.fill || "",
        photoFill: null,
      });
    });
    group.querySelectorAll("rect.bar-photo").forEach((photo) => {
      const bar = snapshot.bars.get(barKey((photo as any).__data__));
      if (bar) bar.photoFill = photo.getAttribute("fill");
    });
  });

  return snapshot;
}

/** Animate the freshly drawn chart from the positions captured in `previous` */
export function animateChartChanges(previous: ChartSnapshot | null): void {
  if (!previous || !canAnimate()) return;
  const svg = document.querySelector<SVGSVGElement>("#calendar-area > svg");
  const container = svg && svg.querySelector<SVGGElement>("#container");
  if (!svg || !container) return;

  const newHeight = num(svg, "height");
  if (previous.height && previous.height !== newHeight) {
    svg.animate(
      [{ height: previous.height + "px" }, { height: newHeight + "px" }],
      timing()
    );
  }

  const groups = yearGroups(container);
  const existingIndexes = groups
    .map((group, i) => (previous.groupY.has(group.id) ? i : -1))
    .filter((i) => i >= 0);
  const firstExisting = existingIndexes[0];
  const lastExisting = existingIndexes[existingIndexes.length - 1];

  groups.forEach((group, i) => {
    const newY = translateY(group);
    const oldY = previous.groupY.get(group.id);

    if (oldY === undefined) {
      // New years slide in from the side they were loaded on, nearest first
      let order = i;
      let offset = -8;
      if (firstExisting !== undefined && i < firstExisting) {
        order = firstExisting - 1 - i;
        offset = -16;
      } else if (lastExisting !== undefined && i > lastExisting) {
        order = i - lastExisting - 1;
        offset = 16;
      }
      group.animate(
        [
          { opacity: 0, transform: `translate(0px, ${newY + offset}px)` },
          { opacity: 1, transform: `translate(0px, ${newY}px)` },
        ],
        timing({
          delay: Math.min(order, MAX_STAGGER_STEPS) * STAGGER,
          fill: "backwards",
        })
      );
      return;
    }

    if (oldY !== newY) {
      group.animate(
        [
          { transform: `translate(0px, ${oldY}px)` },
          { transform: `translate(0px, ${newY}px)` },
        ],
        timing()
      );
    }
    animateWithinGroup(group, previous);
  });

  fadeOutRemovedBars(container, groups, previous);
}

function animateWithinGroup(group: SVGGElement, previous: ChartSnapshot) {
  group
    .querySelectorAll<SVGRectElement>("rect.bar, rect.bar-photo")
    .forEach((rect) => {
      const old = previous.bars.get(barKey((rect as any).__data__));
      if (!old) {
        rect.animate(
          [{ opacity: 0, transform: "scale(0.6)", offset: 0 }],
          timing({ delay: DURATION / 4, fill: "backwards" })
        );
        return;
      }
      const dx = old.x - num(rect, "x");
      const dy = old.y - num(rect, "y");
      if (dx || dy) {
        rect.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          timing()
        );
      }
    });

  const label = group.querySelector("text.year-label");
  const oldLabel = previous.labels.get(group.id);
  if (label && oldLabel) {
    const dy = oldLabel.y - num(label, "y");
    if (dy) {
      label.animate(
        [{ transform: `translate(0px, ${dy}px)` }, { transform: "none" }],
        timing()
      );
    }
  }

  const band = group.querySelector("rect.current-year-band");
  const oldBandHeight = previous.bandHeight.get(group.id);
  const newBandHeight = band ? num(band, "height") : 0;
  if (band && oldBandHeight && newBandHeight && oldBandHeight !== newBandHeight) {
    band.animate(
      [
        { transform: `scaleY(${oldBandHeight / newBandHeight})` },
        { transform: "none" },
      ],
      timing()
    );
  }
}

/** Removed bars no longer exist in the new chart, so fade out stand-ins at their old spots */
function fadeOutRemovedBars(
  container: SVGGElement,
  groups: SVGGElement[],
  previous: ChartSnapshot
) {
  const present = new Set<string>();
  container
    .querySelectorAll("rect.bar")
    .forEach((bar) => present.add(barKey((bar as any).__data__)));

  const removed = Array.from(previous.bars.entries()).filter(
    ([key]) => !present.has(key)
  );
  const presentGroups = new Set(groups.map((group) => group.id));
  const removedLabels = Array.from(previous.labels.entries()).filter(
    ([groupId]) => !presentGroups.has(groupId)
  );
  if (!removed.length && !removedLabels.length) return;

  const layer = document.createElementNS(SVG_NS, "g");
  layer.setAttribute("class", "ghost-layer");
  layer.setAttribute("pointer-events", "none");
  container.insertBefore(layer, groups[0] || null);

  const animations: Animation[] = [];
  const addGhost = (bar: BarSnapshot, className: string, fill: string) => {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("class", className);
    rect.setAttribute("x", String(bar.x));
    rect.setAttribute("y", String(bar.absY));
    rect.setAttribute("width", String(bar.width));
    rect.setAttribute("height", String(bar.height));
    rect.setAttribute("rx", String(bar.rx));
    rect.setAttribute("ry", String(bar.rx));
    rect.style.fill = fill;
    layer.appendChild(rect);
    animations.push(
      rect.animate(
        [{ opacity: 0, transform: "scale(0.6)" }],
        timing({ duration: DURATION * 0.75, fill: "forwards" })
      )
    );
  };

  removed.forEach(([, bar]) => {
    addGhost(bar, "bar-ghost", bar.fill);
    if (bar.photoFill) addGhost(bar, "bar-ghost bar-photo", bar.photoFill);
  });

  removedLabels.forEach(([groupId, label]) => {
    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("class", "year-label");
    text.setAttribute("x", String(label.x));
    text.setAttribute("y", String((previous.groupY.get(groupId) || 0) + label.y));
    text.textContent = label.text;
    layer.appendChild(text);
    animations.push(
      text.animate(
        [{ opacity: 0 }],
        timing({ duration: DURATION * 0.75, fill: "forwards" })
      )
    );
  });

  Promise.all(animations.map((animation) => animation.finished))
    .catch(() => undefined)
    .then(() => layer.remove());
}

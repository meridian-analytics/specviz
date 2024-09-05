import type * as Rect from "./rect"
import type * as Vector2 from "./vector2"

type tpositional = SVGLineElement | SVGRectElement | SVGTextElement

type tformat = (q: number) => string

export function hide(svg: SVGElement) {
  svg.setAttribute("display", "none")
}

export function show(svg: SVGElement) {
  svg.setAttribute("display", "inline")
}

export function setAnchor(
  svg: SVGTextElement,
  anchor: Vector2.tvector2,
  format: tformat = String,
) {
  if (anchor.x < 0.5) {
    setX(svg, anchor.x, undefined, format)
    svg.setAttribute("text-anchor", "start")
  } else {
    setX(svg, anchor.x, undefined, format)
    svg.setAttribute("text-anchor", "end")
  }
  if (anchor.y < 0.5) {
    setY(svg, anchor.y + 0.01, undefined, format)
    svg.setAttribute("dominant-baseline", "hanging")
  } else {
    setY(svg, anchor.y - 0.01, undefined, format)
    svg.setAttribute("dominant-baseline", "text-top")
  }
}

/** todo: unused */
export function setPath(svg: SVGPathElement, path: string) {
  svg.setAttribute("d", path)
}

export function setRect(
  svg: SVGRectElement,
  rect: Rect.trect,
  format: tformat = String,
) {
  svg.setAttribute("x", format(rect.x))
  svg.setAttribute("y", format(rect.y))
  svg.setAttribute("width", format(rect.width))
  svg.setAttribute("height", format(rect.height))
}

export function setText(svg: SVGTextElement, text: string) {
  svg.textContent = text
}

/** todo: unused */
export function setTransform(
  svg: SVGElement,
  translate: Vector2.tvector2,
  scale: Vector2.tvector2,
) {
  svg.setAttribute(
    "transform",
    `translate(${-translate.x}, ${-translate.y}) scale(${scale.x}, ${scale.y})`,
  )
}

export function setX(
  svg: tpositional,
  x1: number,
  x2: number = x1,
  format: tformat = String,
) {
  switch (svg.constructor) {
    case SVGTextElement:
      svg.setAttribute("x", format(x1))
      break
    case SVGLineElement:
      svg.setAttribute("x1", format(x1))
      svg.setAttribute("x2", format(x2))
      break
    case SVGRectElement:
      svg.setAttribute("x", format(x1))
      svg.setAttribute("width", format(x2))
      break
  }
}

export function setY(
  svg: tpositional,
  y1: number,
  y2: number = y1,
  format: tformat = String,
) {
  switch (svg.constructor) {
    case SVGTextElement:
      svg.setAttribute("y", format(y1))
      break
    case SVGLineElement:
      svg.setAttribute("y1", format(y1))
      svg.setAttribute("y2", format(y2))
      break
    case SVGRectElement:
      svg.setAttribute("y", format(y1))
      svg.setAttribute("height", format(y2))
      break
  }
}

import type { Date13TimeFormat as Date13TimeFormatClass } from "../date13-intl";

declare global {
  namespace Intl {
    const Date13TimeFormat: typeof Date13TimeFormatClass;
  }
}
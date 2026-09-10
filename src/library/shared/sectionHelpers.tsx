import * as React from "react";
import {
  MaybeRTF,
  getThemeColorCssValue,
  type ComprehensiveCTAValue,
  type MaybeRTFProps,
  type RichText,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextEntityField,
} from "@yext/visual-editor";
import type {
  ComplexImageType,
  ImageType,
} from "@yext/pages-components";

export type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

/** Options formerly exposed as ThemeOptions.ASPECT_RATIO. */
export const aspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
];

export const createCtaValue = ({
  label,
  link,
  eventName,
  variant = "primary",
  color,
}: {
  label: string;
  link: string;
  eventName: string;
  variant?: "primary" | "secondary";
  color?: ThemeColor;
}): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        label,
        link,
        linkType: "URL",
        ctaType: label === "Get Directions" ? "getDirections" : "textAndLink",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
  },
  styles: {
    variant,
    color,
    button: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      borderRadius: "default",
      letterSpacing: "default",
    },
  },
  eventName,
});

type TypographyDefaults = {
  family: string;
  size: string;
  weight: string;
  transform: string;
};

export const getTextStyle = (
  styles: StyledTextValue,
  defaults?: TypographyDefaults,
  color?: ThemeColor,
): React.CSSProperties => ({
  color: getThemeColorCssValue(color),
  fontFamily:
    styles.fontFamily === "default" ? defaults?.family : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? defaults?.size : styles.fontSize,
  fontWeight:
    styles.fontWeight === "default" ? defaults?.weight : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default"
      ? defaults?.transform
      : styles.textTransform,
});

export const getRichTextStyleOverrides = (
  styles: StyledTextValue | undefined,
  defaults: Omit<TypographyDefaults, "transform">,
  color?: ThemeColor,
): NonNullable<MaybeRTFProps["richTextStyleOverrides"]> => ({
  color: getThemeColorCssValue(color),
  fontFamily:
    !styles || styles.fontFamily === "default"
      ? defaults.family
      : styles.fontFamily,
  fontSize:
    !styles || styles.fontSize === "default" ? defaults.size : styles.fontSize,
  fontWeight:
    !styles || styles.fontWeight === "default"
      ? defaults.weight
      : styles.fontWeight,
  fontStyle:
    !styles || styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    !styles || styles.textTransform === "default"
      ? "default"
      : styles.textTransform,
});

export const renderRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  if (React.isValidElement(value)) {
    if (!richTextStyleOverrides) {
      return value;
    }

    return React.cloneElement(
      value as React.ReactElement<{ style?: React.CSSProperties }>,
      {
        style: {
          ...(value.props as { style?: React.CSSProperties }).style,
          ...richTextStyleOverrides,
          color: getThemeColorCssValue(richTextStyleOverrides.color),
        },
      },
    );
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;

  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }

  return false;
};

export const getScopedLinkStyles = (scopeClass: string): string => `
  .${scopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${scopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

export const getScopedTypographyStyles = (scopeClass: string): string => `
  .${scopeClass},
  .${scopeClass} p,
  .${scopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  ${[1, 2, 3, 4, 5, 6]
    .map(
      (level) => `.${scopeClass} h${level} {
    font-family: var(--fontFamily-h${level}-fontFamily);
    font-size: var(--fontSize-h${level}-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h${level}-fontWeight);
    font-style: var(--fontStyle-h${level}-fontStyle);
    text-transform: var(--textTransform-h${level}-textTransform);
  }`,
    )
    .join("\n  ")}
  ${getScopedLinkStyles(scopeClass)}
`;

export const hasImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): boolean => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string" && image.url.trim()) {
    return true;
  }

  return Boolean(
    "image" in image &&
      image.image &&
      typeof image.image === "object" &&
      "url" in image.image &&
      typeof image.image.url === "string" &&
      image.image.url.trim(),
  );
};

export const resolveBorderRadius = (value?: string): string | undefined =>
  !value || value === "default" ? undefined : value;

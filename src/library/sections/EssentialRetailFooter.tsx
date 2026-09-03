import type { SectionConfig } from "@yext/visual-editor";

import { type PuckComponent } from "@puckeditor/core";
import {
  EntityField,
  Image,
  VisibilityWrapper,
  createItemSource,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  ThemeOptions,
  toPuckFields,
  useDocument,
  type StyledImageValue,
  type StyledLinkValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  type AddressType,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import { Link } from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";

const footerTypographyScopeClass = "yer-footer-typography";

const footerTypographyStyles = `
  .${footerTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${footerTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${footerTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${footerTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${footerTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${footerTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${footerTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${footerTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${footerTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${footerTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${footerTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
  .${footerTypographyScopeClass} a.yer-footer__phoneLink {
    text-decoration: underline;
  }
  .${footerTypographyScopeClass} a.yer-footer__phoneLink:hover,
  .${footerTypographyScopeClass} a.yer-footer__phoneLink:focus-visible {
    text-decoration: none;
  }
`;

type FooterLinkItemProps = {
  label: YextEntityField<TranslatableString>;
  link: YextEntityField<TranslatableString>;
};

type FooterSocialLink = {
  link: YextEntityField<TranslatableString>;
  iconImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
};

type FooterAddressProps = {
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type ResolvedPhoneItem = {
  label: string;
  originalNumber: string;
  formattedNumber: string;
  telDigits: string;
  fieldId: string;
  constantValueEnabled: boolean | undefined;
};

type TextStylesProps = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type LinkStylesProps = {
  styles: StyledLinkValue;
  fontColor?: ThemeColor;
};

const defaultSocialIconImage: FooterSocialLink["iconImage"] = {
  field: "",
  constantValueEnabled: true,
  constantValue: {
    url: "",
    width: 0,
    height: 0,
  },
};

const footerLinkDefault = (
  label: string,
  link: string,
): FooterLinkItemProps => ({
  label: {
    field: "",
    constantValue: {
      defaultValue: label,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  link: {
    field: "",
    constantValue: {
      defaultValue: link,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
});

const primaryFooterLinksSource = createItemSource<FooterLinkItemProps>({
  label: "Primary Links",
  mappingFields: {
    label: {
      label: "Label",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    link: {
      label: "Link",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
  },
  defaultValues: [
    footerLinkDefault("Departments", "#"),
    footerLinkDefault("Shopping Services", "#"),
    footerLinkDefault("Locations", "#"),
    footerLinkDefault("Returns", "#"),
    footerLinkDefault("Contact", "#"),
  ],
});

const footerSocialLinksSource = createItemSource<FooterSocialLink>({
  label: "Social Links",
  mappingFields: {
    iconImage: {
      type: "entityField",
      label: "Icon Image",
      filter: { types: ["type.image"] },
    },
    link: {
      label: "Link",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
  },
  defaultValues: Array.from({ length: 3 }, () => ({
    iconImage: defaultSocialIconImage,
    link: {
      field: "",
      constantValue: {
        defaultValue: "#",
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
  })),
});

type FooterProps = {
  logoImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles: StyledImageValue;
  };
  logoLink: FooterLinkItemProps;
  primaryLinks: typeof primaryFooterLinksSource.value;
  socialLinks: typeof footerSocialLinksSource.value;
  socialIconStyles: StyledImageValue;
  address: FooterAddressProps;
  phones: PhoneFieldProps;
  footerLinkStyles: LinkStylesProps;
  bodyTextStyles: TextStylesProps;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const footerFields: YextFields<FooterProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  logoImage: {
    label: "Logo Image",
    type: "object",
    objectFields: {
      image: {
        type: "entityField",
        label: "Image",
        filter: { types: ["type.image"] },
      },
      aspectRatio: {
        type: "basicSelector",
        label: "Aspect Ratio",
        options: ThemeOptions.ASPECT_RATIO,
      },
      imageConstrain: {
        label: "Image Constrain",
        type: "select",
        options: [
          { label: "Fixed", value: "fixed" },
          { label: "Filled", value: "filled" },
        ],
      },
      styles: {
        label: "Image Styles",
        type: "styledImage",
      },
    },
  },
  logoLink: {
    label: "Logo Link",
    type: "object",
    objectFields: {
      label: {
        label: "Label",
        type: "entityField",
        filter: { types: ["type.string"] },
      },
      link: {
        label: "Link",
        type: "entityField",
        filter: { types: ["type.string"] },
      },
    },
  },
  primaryLinks: primaryFooterLinksSource.field,
  socialLinks: footerSocialLinksSource.field,
  socialIconStyles: {
    label: "Social Icon Styles",
    type: "styledImage",
  },
  address: {
    label: "Address",
    type: "object",
    objectFields: {
      address: {
        type: "entityField",
        label: "Address",
        filter: { types: ["type.address"] },
      },
      showRegion: {
        label: "Show Region",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showCountry: {
        label: "Show Country",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  phones: {
    label: "Phones",
    type: "object",
    objectFields: {
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          number: {
            type: "entityField",
            label: "Number",
            filter: {
              types: ["type.phone"],
            },
          },
          label: {
            label: "Label",
            type: "text",
          },
        },
        defaultItemProps: {
          number: {
            field: "mainPhone",
            constantValue: "",
            constantValueEnabled: false,
          } as YextEntityField<string>,
          label: "",
        },
        getItemSummary: (item) => item.label || item.number.field || "Phone",
      },
      phoneFormat: {
        label: "Phone Format",
        type: "radio",
        options: [
          { label: "Domestic", value: "domestic" },
          { label: "International", value: "international" },
        ],
      },
      includeHyperlink: {
        label: "Include Hyperlink",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  footerLinkStyles: {
    label: "Footer Link Styles",
    type: "object",
    objectFields: {
      styles: {
        label: "Link Styles",
        type: "styledLink",
        showIncludeCaretField: false,
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  bodyTextStyles: {
    label: "Body Text Styles",
    type: "object",
    objectFields: {
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
};

const FooterDefaultUtilityIcon = () => (
  <svg
    fill="none"
    height="20"
    viewBox="0 0 32 32"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m11.75 9h.25c.275 0 .5.225.5.5s-.225.5-.5.5h-.25c-.9656 0-1.75.7844-1.75 1.75v.25c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-.25c0-1.5187 1.2313-2.75 2.75-2.75zm-2.25 5c.275 0 .5.225.5.5v3c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-3c0-.275.225-.5.5-.5zm13 0c.275 0 .5.225.5.5v3c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-3c0-.275.225-.5.5-.5zm0-1.5c-.275 0-.5-.225-.5-.5v-.25c0-.9656-.7844-1.75-1.75-1.75h-.25c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h.25c1.5188 0 2.75 1.2313 2.75 2.75v.25c0 .275-.225.5-.5.5zm.5 7.5v.25c0 1.5188-1.2312 2.75-2.75 2.75h-.25c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h.25c.9656 0 1.75-.7844 1.75-1.75v-.25c0-.275.225-.5.5-.5s.5.225.5.5zm-13 0v.25c0 .9656.7844 1.75 1.75 1.75h.25c.275 0 .5.225.5.5s-.225.5-.5.5h-.25c-1.5187 0-2.75-1.2312-2.75-2.75v-.25c0-.275.225-.5.5-.5s.5.225.5.5zm4.5 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h3c.275 0 .5.225.5.5s-.225.5-.5.5zm-.5-13.5c0-.275.225-.5.5-.5h3c.275 0 .5.225.5.5s-.225.5-.5.5h-3c-.275 0-.5-.225-.5-.5z"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

const hasImageSource = (
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

const resolveBorderRadius = (value?: string): string | undefined =>
  !value || value === "default" ? undefined : value;

const renderSocialIcon = (
  iconImage: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
  styles: StyledImageValue,
) => {
  if (!iconImage || !hasImageSource(iconImage)) {
    return <FooterDefaultUtilityIcon />;
  }

  const borderRadius = resolveBorderRadius(styles.borderRadius);

  return (
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius,
        overflow: borderRadius ? "hidden" : undefined,
      }}
    >
      <Image
        image={iconImage}
        className="h-full w-full"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

const buildTextStyle = (
  styles: StyledTextValue,
  color: ThemeColor | undefined,
): React.CSSProperties => ({
  color: getThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const buildLinkStyle = (
  styles: StyledLinkValue,
  color: ThemeColor | undefined,
): React.CSSProperties => ({
  color: getThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  letterSpacing:
    styles.letterSpacing === "default" ? undefined : styles.letterSpacing,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
  textDecoration: "none",
});

const buildLogoFrameStyle = (logoImage: FooterProps["logoImage"]) => ({
  aspectRatio: logoImage.aspectRatio > 0 ? logoImage.aspectRatio : undefined,
  borderRadius:
    logoImage.styles.borderRadius === "default"
      ? undefined
      : logoImage.styles.borderRadius,
  overflow:
    logoImage.imageConstrain === "filled" ||
    logoImage.styles.borderRadius !== "default"
      ? "hidden"
      : undefined,
});

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic",
) => {
  const cleaned = phoneNumberString.replace(/(?!^\+)\+|[^\d+]/g, "");
  const parsed = parsePhoneNumber(cleaned);

  if (!parsed.valid || !parsed.number) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

export const EssentialRetailFooterComponent: PuckComponent<FooterProps> = ({
  id,
  logoImage,
  logoLink,
  primaryLinks,
  socialLinks,
  socialIconStyles,
  address,
  phones,
  footerLinkStyles,
  bodyTextStyles,
  section,
  puck,
}) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailFooter${getAnalyticsScopeHash(id)}`;
  const resolvedLogoImage = resolveComponentData(
    logoImage.image,
    locale,
    streamDocument,
  );
  const hasResolvedLogoImage = Boolean(
    resolvedLogoImage &&
    typeof resolvedLogoImage === "object" &&
    "url" in resolvedLogoImage &&
    typeof resolvedLogoImage.url === "string" &&
    resolvedLogoImage.url.trim(),
  );
  const resolvedLogoLabel = resolveComponentData(
    logoLink.label,
    locale,
    streamDocument,
  );
  const resolvedLogoLink = resolveComponentData(
    logoLink.link,
    locale,
    streamDocument,
  );
  const resolvedAddress = resolveComponentData(
    address.address,
    locale,
    streamDocument,
  );
  const resolvedPrimaryLinks = primaryFooterLinksSource
    .resolveItems(primaryLinks, streamDocument)
    .map((item, index) => {
      const resolvedLabel = item.label
        ? resolveComponentData(item.label, locale, streamDocument)
        : undefined;
      const resolvedLink = item.link
        ? resolveComponentData(item.link, locale, streamDocument)
        : undefined;

      return {
        index,
        label: typeof resolvedLabel === "string" ? resolvedLabel : "",
        link: typeof resolvedLink === "string" ? resolvedLink.trim() : "",
      };
    })
    .filter((item) => Boolean(item.link));
  const resolvedSocialLinks = footerSocialLinksSource
    .resolveItems(socialLinks, streamDocument)
    .map((item, index) => {
      const resolvedLink = item.link
        ? resolveComponentData(item.link, locale, streamDocument)
        : undefined;
      return {
        index,
        link: typeof resolvedLink === "string" ? resolvedLink.trim() : "",
        iconImage: item.iconImage,
      };
    })
    .filter((item) => Boolean(item.link));
  const phoneItems = (phones.items ?? [])
    .map((item) => {
      const resolvedNumber = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const normalized =
        typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";

      if (!normalized) {
        return null;
      }

      return {
        label: item.label?.trim() ?? "",
        originalNumber: normalized,
        formattedNumber: formatPhoneNumber(normalized, phones.phoneFormat),
        telDigits: normalized.replace(/\D/g, ""),
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
      };
    })
    .filter((item): item is ResolvedPhoneItem => item !== null);

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <footer
          className={`yer-footer ${footerTypographyScopeClass}`}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
              .yer-footer {
                padding: 40px 0;
              }

              .yer-footer__inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 15px;
              }

              .yer-footer__logoLink {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 72px;
                margin-bottom: 30px;
                text-decoration: none;
                flex-shrink: 0;
              }

              .yer-footer__logoFrame {
                display: inline-flex;
                width: auto;
                height: 100%;
                overflow: hidden;
              }

              .yer-footer__links {
                display: flex;
                flex-wrap: wrap;
                gap: 16px 32px;
                margin-bottom: 30px;
                font-size: 14px;
                letter-spacing: 0.01em;
              }

              .yer-footer__link {
                text-decoration: none;
              }

              .yer-footer__link:hover,
              .yer-footer__link:focus-visible,
              .yer-footer__socialLink:hover,
              .yer-footer__socialLink:focus-visible {
                opacity: 0.65;
              }

              .yer-footer__social {
                display: flex;
                gap: 16px;
                margin-bottom: 24px;
                flex-wrap: wrap;
              }

              .yer-footer__socialLink {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                text-decoration: none;
              }

              .yer-footer__legal {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
                padding-top: 15px;
                border-top: 1px solid currentColor;
                font-size: 16px;
                letter-spacing: 0.01em;
              }

              .yer-footer__legalText {
                overflow-wrap: anywhere;
              }

              .yer-footer__phones {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
              }

              .yer-footer__legalLink {
                text-decoration: none;
              }

              .yer-footer__legalLink:hover,
              .yer-footer__legalLink:focus-visible,
              .yer-footer__socialLink:focus-visible {
                opacity: 0.65;
              }

              @media (min-width: 768px) {
                .yer-footer__inner {
                  padding-right: 32px;
                  padding-left: 32px;
                }
              }

              @media (min-width: 990px) {
                .yer-footer {
                  padding: 80px 0;
                }

                .yer-footer__inner {
                  padding-right: 60px;
                  padding-left: 60px;
                }

                .yer-footer__legal {
                  flex-direction: row;
                  flex-wrap: wrap;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                }
              }
            `}
          </style>
          <style>{footerTypographyStyles}</style>
          <div className="yer-footer__inner">
            {hasResolvedLogoImage && resolvedLogoImage ? (
              <EntityField
                displayName="Logo Link"
                fieldId={logoLink.link.field}
                constantValueEnabled={logoLink.link.constantValueEnabled}
              >
                <a
                  href={
                    typeof resolvedLogoLink === "string" && resolvedLogoLink
                      ? resolvedLogoLink
                      : "#"
                  }
                  className="yer-footer__logoLink"
                  aria-label={
                    typeof resolvedLogoLabel === "string" && resolvedLogoLabel
                      ? resolvedLogoLabel
                      : "Logo"
                  }
                >
                  <EntityField
                    displayName="Logo Image"
                    fieldId={logoImage.image.field}
                    constantValueEnabled={logoImage.image.constantValueEnabled}
                  >
                    <div
                      className="yer-footer__logoFrame"
                      style={buildLogoFrameStyle(logoImage)}
                    >
                      <Image
                        image={resolvedLogoImage}
                        className="h-full w-full"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius:
                            logoImage.styles.borderRadius === "default"
                              ? undefined
                              : logoImage.styles.borderRadius,
                          objectFit:
                            logoImage.imageConstrain === "filled"
                              ? "cover"
                              : "contain",
                        }}
                      />
                    </div>
                  </EntityField>
                </a>
              </EntityField>
            ) : null}
            <EntityField
              displayName="Primary Links"
              fieldId={primaryLinks.field}
              constantValueEnabled={primaryLinks.constantValueEnabled}
            >
              <nav aria-label="Footer" className="yer-footer__links">
                {resolvedPrimaryLinks.map((item) => (
                  <a
                    key={`${item.link}-${item.index}`}
                    href={item.link}
                    className="yer-footer__link"
                    style={buildLinkStyle(
                      footerLinkStyles.styles,
                      footerLinkStyles.fontColor,
                    )}
                  >
                    {item.label || "Link"}
                  </a>
                ))}
              </nav>
            </EntityField>
            <EntityField
              displayName="Social Links"
              fieldId={socialLinks.field}
              constantValueEnabled={socialLinks.constantValueEnabled}
            >
              <div aria-label="Social media" className="yer-footer__social">
                {resolvedSocialLinks.map((item) => (
                  <a
                    key={`${item.link}-${item.index}`}
                    href={item.link}
                    aria-label={`Social media link ${item.index + 1}`}
                    className="yer-footer__socialLink"
                    style={buildLinkStyle(
                      footerLinkStyles.styles,
                      footerLinkStyles.fontColor,
                    )}
                  >
                    {renderSocialIcon(item.iconImage, socialIconStyles)}
                  </a>
                ))}
              </div>
            </EntityField>
            <div className="yer-footer__legal">
              {resolvedAddress ? (
                <EntityField
                  displayName="Address"
                  fieldId={address.address.field}
                  constantValueEnabled={address.address.constantValueEnabled}
                >
                  <div
                    className="yer-footer__legalText"
                    style={buildTextStyle(
                      bodyTextStyles.styles,
                      bodyTextStyles.fontColor,
                    )}
                  >
                    <Address
                      address={resolvedAddress}
                      showRegion={address.showRegion}
                      showCountry={address.showCountry}
                    />
                  </div>
                </EntityField>
              ) : null}
              {phoneItems.length > 0 ? (
                <div className="yer-footer__phones">
                  {phoneItems.map((item, index) => {
                    const content = item.label
                      ? `${item.label} ${item.formattedNumber}`
                      : item.formattedNumber;

                    return (
                      <EntityField
                        key={`${item.originalNumber}-${index}`}
                        displayName="Phone Number"
                        fieldId={item.fieldId}
                        constantValueEnabled={item.constantValueEnabled}
                      >
                        {phones.includeHyperlink && item.telDigits ? (
                          <span
                            className="yer-footer__legalText"
                            style={buildTextStyle(
                              bodyTextStyles.styles,
                              bodyTextStyles.fontColor,
                            )}
                          >
                            {item.label ? `${item.label} ` : null}
                            <Link
                              cta={{
                                link: item.telDigits,
                                linkType: "PHONE",
                              }}
                              className="yer-footer__phoneLink"
                              style={buildTextStyle(
                                bodyTextStyles.styles,
                                bodyTextStyles.fontColor,
                              )}
                            >
                              {item.formattedNumber}
                            </Link>
                          </span>
                        ) : (
                          <span
                            className="yer-footer__legalText"
                            style={buildTextStyle(
                              bodyTextStyles.styles,
                              bodyTextStyles.fontColor,
                            )}
                          >
                            {content}
                          </span>
                        )}
                      </EntityField>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </footer>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailFooter: YextComponentConfig<FooterProps> = {
  label: "Footer",
  fields: toPuckFields(footerFields),
  defaultProps: {
    logoImage: {
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/OLT2KExDEKhKlCmIobyRRHN6MFUS77fVs5gIt_FTnBI/450x450.jpg",
          width: 450,
          height: 450,
        },
        constantValueEnabled: true,
      },
      aspectRatio: 1,
      imageConstrain: "filled",
      styles: {
        borderRadius: "default",
      },
    },
    logoLink: footerLinkDefault("Logo", "#"),
    primaryLinks: primaryFooterLinksSource.defaultValue,
    socialLinks: footerSocialLinksSource.defaultValue,
    socialIconStyles: {
      borderRadius: "default",
    },
    address: {
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          postalCode: "",
          countryCode: "",
          region: "",
        },
        constantValueEnabled: false,
      } satisfies YextEntityField<AddressType>,
      showRegion: true,
      showCountry: false,
    },
    phones: {
      items: [
        {
          number: {
            field: "mainPhone",
            constantValue: "",
            constantValueEnabled: false,
          } satisfies YextEntityField<string>,
          label: "",
        },
      ],
      phoneFormat: "domestic",
      includeHyperlink: true,
    },
    footerLinkStyles: {
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
        letterSpacing: "default",
        includeCaret: "default",
      },
      fontColor: undefined,
    },
    bodyTextStyles: {
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      fontColor: undefined,
    },
    section: {
      visibleOnLivePage: true,
      backgroundColor: {
        selectedColor: "palette-tertiary",
        contrastingColor: "palette-tertiary-contrast",
      },
    },
  },
  render: EssentialRetailFooterComponent,
};

export const config: SectionConfig = {
  id: "EssentialRetailFooter",
  displayName: "Footer",
  description: "Footer",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};

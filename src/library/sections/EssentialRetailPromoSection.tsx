import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  getDefaultRTF,
  resolveComponentData,
  ThemeOptions,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";

const promoTypographyScopeClass = "yer-promo-typography";

const promoTypographyStyles = `
  .${promoTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${promoTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${promoTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${promoTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${promoTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${promoTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${promoTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${promoTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${promoTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${promoTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${promoTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type PromoProps = {
  promoImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  cta: ComprehensiveCTAValue;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const buildTextStyle = (
  styles: StyledTextValue,
  vars: { family: string; size: string; weight: string; transform: string },
  color?: ThemeColor,
) => ({
  color: getThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? vars.family : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? vars.size : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? vars.weight : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? vars.transform : styles.textTransform,
});

const buildRichTextStyleOverrides = (
  styles: StyledTextValue,
  vars: { family: string; size: string; weight: string },
  color?: ThemeColor,
) => ({
  color: getThemeColorCssValue(color),
  fontFamily: styles.fontFamily === "default" ? vars.family : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? vars.size : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? vars.weight : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform: (styles.textTransform === "default"
    ? "default"
    : styles.textTransform) as
    "default" | "none" | "uppercase" | "lowercase" | "capitalize",
});

const promoFields: YextFields<PromoProps> = {
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
  promoImage: {
    label: "Promo Image",
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
    },
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: "Text",
        filter: { types: ["type.string"] },
      },
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
  body: {
    label: "Body",
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: "Text",
        filter: { types: ["type.rich_text_v2"] },
      },
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
  cta: {
    label: "Call to Action",
    type: "comprehensiveCTA",
  },
};

const makeCtaValue = (
  label: string,
  link: string,
  eventName: string,
): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        label,
        link,
        linkType: "URL",
        ctaType: "textAndLink",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
  },
  styles: {
    variant: "primary",
    color: undefined,
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

export const EssentialRetailPromoSectionComponent: PuckComponent<
  PromoProps
> = ({ id, promoImage, heading, body, cta, section, puck }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailPromoSection${getAnalyticsScopeHash(id)}`;
  const resolvedImage = resolveComponentData(
    promoImage.image,
    locale,
    streamDocument,
  );
  const hasResolvedImage = Boolean(
    resolvedImage &&
    typeof resolvedImage === "object" &&
    (("url" in resolvedImage &&
      typeof resolvedImage.url === "string" &&
      resolvedImage.url.trim()) ||
      ("image" in resolvedImage &&
        resolvedImage.image &&
        typeof resolvedImage.image === "object" &&
        "url" in resolvedImage.image &&
        typeof resolvedImage.image.url === "string" &&
        resolvedImage.image.url.trim())),
  );
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const bodyOverrides = {
    ...buildRichTextStyleOverrides(
      body.styles,
      {
        family: "var(--fontFamily-body-fontFamily)",
        size: "var(--fontSize-body-fontSize)",
        weight: "var(--fontWeight-body-fontWeight)",
      },
      body.fontColor,
    ),
    lineHeight: 1.2,
    letterSpacing: "0.01em",
  };
  const resolvedBody = resolveComponentData(body.text, locale, streamDocument, {
    richTextStyleOverrides: bodyOverrides,
  });

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          className={`${promoTypographyScopeClass} yer-promo${hasResolvedImage ? "" : " yer-promo--no-image"}`}
          as="section"
          background={section.backgroundColor}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
                .yer-promo {
                  display: grid;
                  grid-template-columns: minmax(0, 1fr);
                  overflow: hidden;
                }

                .yer-promo__media {
                  margin: 0;
                  width: 100%;
                  aspect-ratio: 391 / 200;
                  overflow: hidden;
                }

                .yer-promo__image {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }

                .yer-promo__content {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  justify-content: flex-start;
                  padding: 40px 15px;
                }

                .yer-promo__heading {
                  margin: 0;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-promo__actions {
                  padding-top: 16px;
                }

                @media (min-width: 768px) {
                  .yer-promo__media {
                    aspect-ratio: 768 / 400;
                  }

                  .yer-promo__content {
                    padding-right: 32px;
                    padding-left: 32px;
                  }
                }

                @media (min-width: 990px) {
                  .yer-promo {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    align-items: stretch;
                  }

                  .yer-promo--no-image {
                    grid-template-columns: minmax(0, 1fr);
                  }

                  .yer-promo--no-image .yer-promo__content {
                    width: 100%;
                    max-width: 1440px;
                    margin: 0 auto;
                    padding-top: 80px;
                    padding-bottom: 80px;
                  }

                  .yer-promo__media {
                    aspect-ratio: auto;
                    min-height: 100%;
                    height: 100%;
                  }

                  .yer-promo__content {
                    justify-content: center;
                    align-self: stretch;
                    padding: 0 80px;
                  }
                }
              `}
          </style>
          <style>{promoTypographyStyles}</style>
          {(() => {
            if (!hasResolvedImage || !resolvedImage) {
              return null;
            }

            return (
              <EntityField
                displayName="Promo Image"
                fieldId={promoImage.image.field}
                constantValueEnabled={promoImage.image.constantValueEnabled}
              >
                <figure
                  className="yer-promo__media"
                  style={{ aspectRatio: promoImage.aspectRatio }}
                >
                  <Image
                    image={resolvedImage}
                    className="yer-promo__image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit:
                        promoImage.imageConstrain === "filled"
                          ? "cover"
                          : "contain",
                    }}
                  />
                </figure>
              </EntityField>
            );
          })()}
          <div className="yer-promo__content">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
                className="yer-promo__heading"
                style={buildTextStyle(
                  heading.styles,
                  {
                    family: "var(--fontFamily-h2-fontFamily)",
                    size: "var(--fontSize-h2-fontSize)",
                    weight: "var(--fontWeight-h2-fontWeight)",
                    transform: "var(--textTransform-h2-textTransform)",
                  },
                  heading.fontColor,
                )}
              >
                {resolvedHeading}
              </h2>
            </EntityField>
            <EntityField
              displayName="Body"
              fieldId={body.text.field}
              constantValueEnabled={body.text.constantValueEnabled}
            >
              {typeof resolvedBody === "string" ? (
                <MaybeRTF
                  data={resolvedBody}
                  richTextStyleOverrides={bodyOverrides}
                />
              ) : (
                resolvedBody
              )}
            </EntityField>
            <div className="yer-promo__actions">
              <EntityField
                displayName="Call to Action"
                fieldId={cta.data.cta.field}
                constantValueEnabled={cta.data.cta.constantValueEnabled}
              >
                <ComprehensiveCTA
                  value={cta as Partial<ComprehensiveCTAValue>}
                />
              </EntityField>
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailPromoSection: YextComponentConfig<PromoProps> =
  {
    label: "Promo Section",
    fields: toPuckFields(promoFields),
    defaultProps: {
      promoImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Shop Our Seasonal Collection",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Explore our latest arrivals featuring sustainable fabrics, modern silhouettes, and timeless essentials.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      cta: makeCtaValue("Shop Now", "#", "primaryCta"),
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
      },
    },
    render: EssentialRetailPromoSectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailPromoSection",
  displayName: "Promo Section",
  description: "Promo Section",
  pageSetTypes: ["ENTITY"],
};

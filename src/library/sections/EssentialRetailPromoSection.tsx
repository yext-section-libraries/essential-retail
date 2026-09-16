import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
  Image,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  aspectRatioOptions,
  createCtaValue,
  getRichTextStyleOverrides,
  getScopedTypographyStyles,
  getTextStyle,
  hasImageSource,
  renderRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

const promoTypographyScopeClass = "yer-promo-typography";

const promoTypographyStyles = getScopedTypographyStyles(
  promoTypographyScopeClass,
);

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

const promoFields: YextFields<PromoProps> = {
  section: {
    label: msg("fields.section", "Section"),
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      backgroundColor: {
        label: msg("fields.backgroundColor", "Background Color"),
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  promoImage: {
    label: msg("fields.promoImage", "Promo Image"),
    type: "object",
    objectFields: {
      image: {
        type: "entityField",
        label: msg("fields.image", "Image"),
        filter: { types: ["type.image"] },
      },
      aspectRatio: {
        type: "basicSelector",
        label: msg("fields.options.aspectRatio", "Aspect Ratio"),
        options: aspectRatioOptions,
      },
      imageConstrain: {
        label: msg("fields.imageConstrain", "Image Constrain"),
        type: "select",
        options: [
          { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
          { label: msg("fields.options.filled", "Filled"), value: "filled" },
        ],
      },
    },
  },
  heading: {
    label: msg("fields.heading", "Heading"),
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: msg("fields.text", "Text"),
        filter: { types: ["type.string"] },
      },
      styles: {
        label: msg("fields.textStyles", "Text Styles"),
        type: "styledText",
      },
      fontColor: {
        label: msg("fields.fontColor", "Font Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  body: {
    label: msg("fields.body", "Body"),
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: msg("fields.text", "Text"),
        filter: { types: ["type.rich_text_v2"] },
      },
      styles: {
        label: msg("fields.textStyles", "Text Styles"),
        type: "styledText",
      },
      fontColor: {
        label: msg("fields.fontColor", "Font Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  cta: {
    label: msg("fields.callToAction", "Call to Action"),
    type: "comprehensiveCTA",
  },
};

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
  const hasResolvedImage = hasImageSource(resolvedImage);
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const bodyOverrides = {
    ...getRichTextStyleOverrides(
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
  const resolvedBody = resolveComponentData(body.text, locale, streamDocument);

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
                style={getTextStyle(
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
              {renderRichText(resolvedBody, bodyOverrides)}
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
    fields: promoFields,
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
      cta: createCtaValue({
        label: "Shop Now",
        link: "#",
        eventName: "primaryCta",
      }),
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

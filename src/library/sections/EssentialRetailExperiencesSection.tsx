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
  createItemSource,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getDefaultRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextCTAField,
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
  getRichTextStyleOverrides,
  getScopedTypographyStyles,
  getTextStyle,
  hasImageSource,
  renderRichText,
  type StyledTextProps,
} from "../shared/sectionHelpers";

const experiencesTypographyScopeClass = "yer-experiences-typography";

const experiencesTypographyStyles = getScopedTypographyStyles(
  experiencesTypographyScopeClass,
);

type CardTextStylesProps = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type ExperienceCardFields = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  title: YextEntityField<TranslatableString>;
  body: YextEntityField<TranslatableRichText>;
  cta: YextCTAField;
};

type CardImageStylesProps = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type ExperiencesProps = {
  heading: StyledTextProps;
  cards: typeof experienceCardsSource.value;
  cardStyles: {
    image: CardImageStylesProps;
    headingTextStyles: CardTextStylesProps;
    descriptionTextStyles: CardTextStylesProps;
    ctaStyles: ComprehensiveCTAValue["styles"];
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const makeExperienceCard = (
  imageUrl: string,
  width: number,
  height: number,
  title: string,
  body: string,
  ctaLabel: string,
): ExperienceCardFields => {
  return {
    image: {
      field: "",
      constantValue: {
        url: imageUrl,
        width,
        height,
      },
      constantValueEnabled: true,
    },
    title: {
      field: "",
      constantValue: {
        defaultValue: title,
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    body: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(body),
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    cta: {
      field: "",
      constantValue: {
        label: {
          defaultValue: ctaLabel,
          hasLocalizedValue: "true",
        },
        link: {
          defaultValue: "#",
          hasLocalizedValue: "true",
        },
        linkType: "URL",
        ctaType: "textAndLink",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
  };
};

const experienceCardsSource = createItemSource<ExperienceCardFields>({
  label: "Cards",
  mappingFields: {
    image: {
      type: "entityField",
      label: "Image",
      filter: {
        types: ["type.image"],
      },
    },
    title: {
      type: "entityField",
      label: "Title",
      filter: {
        types: ["type.string"],
      },
    },
    body: {
      type: "entityField",
      label: "Body",
      filter: {
        types: ["type.rich_text_v2"],
      },
    },
    cta: {
      label: "Call to Action",
      type: "ctaSelector",
    },
  },
  defaultValues: [
    makeExperienceCard(
      "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
      1267,
      1900,
      "Personal Styling",
      "Work one-on-one with a style expert to refresh your wardrobe or find the perfect outfit for a special event.",
      "Book a Free Session",
    ),
    makeExperienceCard(
      "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
      1267,
      1900,
      "Premium Denim Lab",
      "Find your perfect fit with our specialized denim consultants and on-site tailoring for hem adjustments.",
      "Browse Denim Collection",
    ),
    makeExperienceCard(
      "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
      1267,
      1900,
      "Buy Online, Pick Up In-Store",
      "Skip the shipping and get your items today. Simply select [[address.city]] at checkout.",
      "Start Shopping",
    ),
    makeExperienceCard(
      "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
      1267,
      1900,
      "Alterations & Tailoring",
      "Ensure every piece fits perfectly. Our on-site tailor provides professional adjustments for garments.",
      "View Tailoring Menu",
    ),
  ],
});

const experiencesFields: YextFields<ExperiencesProps> = {
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
  heading: {
    label: msg("fields.heading", "Heading"),
    type: "object",
    objectFields: {
      text: {
        type: "entityField",
        label: msg("fields.text", "Text"),
        filter: {
          types: ["type.string"],
        },
      },
      styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
      fontColor: {
        label: msg("fields.fontColor", "Font Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  cards: experienceCardsSource.field,
  cardStyles: {
    label: msg("fields.cardStyles", "Card Styles"),
    type: "object",
    objectFields: {
      image: {
        label: msg("fields.imageStyles", "Image Styles"),
        type: "object",
        objectFields: {
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
          styles: {
            label: msg("fields.imageStyles", "Image Styles"),
            type: "styledImage",
          },
        },
      },
      headingTextStyles: {
        label: msg("fields.headingTextStyles", "Heading Text Styles"),
        type: "object",
        objectFields: {
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
      descriptionTextStyles: {
        label: msg("fields.descriptionTextStyles", "Description Text Styles"),
        type: "object",
        objectFields: {
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
      ctaStyles: {
        label: msg("fields.ctaStyles", "CTA Styles"),
        type: "object",
        objectFields: {
          variant: {
            label: msg("fields.variant", "Variant"),
            type: "select",
            options: [
              { label: msg("fields.options.solid", "Solid"), value: "primary" },
              { label: msg("fields.options.outline", "Outline"), value: "secondary" },
              { label: msg("fields.options.link", "Link"), value: "link" },
            ],
          },
          color: {
            label: msg("fields.color", "Color"),
            type: "basicSelector",
            options: "SITE_COLOR",
          },
          button: {
            label: msg("fields.buttonStyles", "Button Styles"),
            type: "styledButton",
          },
          link: {
            label: msg("fields.linkStyles", "Link Styles"),
            type: "styledLink",
          },
        },
      },
    },
  },
};

export const EssentialRetailExperiencesSectionComponent: PuckComponent<
  ExperiencesProps
> = ({ id, heading, cards, cardStyles, section, puck }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailExperiencesSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedCards = experienceCardsSource.resolveItems(
    cards,
    streamDocument,
  );
  const cardsWithResolvedImages = resolvedCards.map((card) => {
    const resolvedImage = card.image;
    const hasResolvedImage = hasImageSource(resolvedImage);

    return {
      card,
      resolvedImage,
      hasResolvedImage,
    };
  });
  const hasAnyCardImage = cardsWithResolvedImages.some(
    ({ hasResolvedImage }) => hasResolvedImage,
  );

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          className={`yer-experiences ${experiencesTypographyScopeClass}`}
          as="section"
          background={section.backgroundColor}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
                .yer-experiences {
                  padding: 40px 0;
                }

                .yer-experiences__inner {
                  max-width: 1440px;
                  margin: 0 auto;
                  padding: 0 15px;
                }

                .yer-experiences__grid {
                  display: grid;
                  grid-template-columns: 1fr;
                  gap: 24px;
                  margin-top: 32px;
                }

                .yer-experiences__card {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  text-align: center;
                  min-width: 0;
                }

                .yer-experiences__media {
                  width: 100%;
                  margin-bottom: 24px;
                  overflow: hidden;
                }

                .yer-experiences__title {
                  margin: 0 0 12px;
                  width: 100%;
                  line-height: 1.3;
                  letter-spacing: 0.01em;
                }

                .yer-experiences__body {
                  display: flex;
                  flex: 1;
                  flex-direction: column;
                  width: 100%;
                  line-height: 1.5;
                }

                .yer-experiences__copy {
                  margin-bottom: 24px;
                  line-height: 1.6;
                }

                .yer-experiences__cta {
                  margin-top: auto;
                  display: flex;
                  justify-content: center;
                  width: 100%;
                  min-width: 0;
                  max-width: 100%;
                }

                .yer-experiences__cta > * {
                  min-width: 0;
                  max-width: 100%;
                }

                .yer-experiences__cta a,
                .yer-experiences__cta button,
                .yer-experiences__cta a *,
                .yer-experiences__cta button * {
                  max-width: 100%;
                  white-space: normal;
                  overflow-wrap: anywhere;
                  word-break: break-word;
                }

                @media (min-width: 768px) {
                  .yer-experiences__inner {
                    padding-right: 32px;
                    padding-left: 32px;
                  }

                  .yer-experiences__grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 32px;
                  }
                }

                @media (min-width: 990px) {
                  .yer-experiences {
                    padding: 80px 0;
                  }

                  .yer-experiences__inner {
                    padding-right: 60px;
                    padding-left: 60px;
                  }

                  .yer-experiences__grid {
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                  }
                }
              `}
          </style>
          <style>{experiencesTypographyStyles}</style>
          <div className="yer-experiences__inner">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
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
              displayName="Experience Cards"
              fieldId={cards.field}
              constantValueEnabled={cards.constantValueEnabled}
            >
              <div className="yer-experiences__grid">
                {cardsWithResolvedImages.map(
                  ({ card, resolvedImage, hasResolvedImage }, index) => {
                    const resolvedTitle = card.title
                      ? (resolveComponentData(
                          card.title,
                          locale,
                          streamDocument,
                          {
                            output: "plainText",
                          },
                        ) ?? "")
                      : "";
                    const bodyStyleOverrides = getRichTextStyleOverrides(
                      cardStyles.descriptionTextStyles.styles,
                      {
                        family: "var(--fontFamily-body-fontFamily)",
                        size: "var(--fontSize-body-fontSize)",
                        weight: "var(--fontWeight-body-fontWeight)",
                      },
                      cardStyles.descriptionTextStyles.fontColor,
                    );
                    const resolvedBody = card.body
                      ? resolveComponentData(card.body, locale, streamDocument)
                      : undefined;
                    const ctaValue: Partial<ComprehensiveCTAValue> | undefined =
                      card.cta
                        ? {
                            data: {
                              actionType: "link",
                              cta: {
                                field: "",
                                constantValue: card.cta,
                                constantValueEnabled: true,
                                selectedType: card.cta.ctaType ?? "textAndLink",
                              },
                              openInNewTab: false,
                            },
                            styles: cardStyles.ctaStyles,
                            eventName: `experienceCta${index}`,
                          }
                        : undefined;

                    return (
                      <article key={index} className="yer-experiences__card">
                        {hasAnyCardImage
                          ? (() => {
                              if (!hasResolvedImage || !resolvedImage) {
                                return (
                                  <div
                                    className="yer-experiences__media"
                                    style={{
                                      aspectRatio: cardStyles.image.aspectRatio,
                                      borderRadius:
                                        cardStyles.image.styles.borderRadius ===
                                        "default"
                                          ? undefined
                                          : cardStyles.image.styles
                                              .borderRadius,
                                    }}
                                  />
                                );
                              }

                              return (
                                <div
                                  className="yer-experiences__media"
                                  style={{
                                    aspectRatio: cardStyles.image.aspectRatio,
                                    borderRadius:
                                      cardStyles.image.styles.borderRadius ===
                                      "default"
                                        ? undefined
                                        : cardStyles.image.styles.borderRadius,
                                  }}
                                >
                                  <Image
                                    image={resolvedImage}
                                    className="h-full w-full"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit:
                                        cardStyles.image.imageConstrain ===
                                        "filled"
                                          ? "cover"
                                          : "contain",
                                      borderRadius:
                                        cardStyles.image.styles.borderRadius ===
                                        "default"
                                          ? undefined
                                          : cardStyles.image.styles
                                              .borderRadius,
                                    }}
                                  />
                                </div>
                              );
                            })()
                          : null}
                        <h3
                          className="yer-experiences__title"
                          style={getTextStyle(
                            cardStyles.headingTextStyles.styles,
                            {
                              family: "var(--fontFamily-h3-fontFamily)",
                              size: "var(--fontSize-h3-fontSize)",
                              weight: "var(--fontWeight-h3-fontWeight)",
                              transform:
                                "var(--textTransform-h3-textTransform)",
                            },
                            cardStyles.headingTextStyles.fontColor,
                          )}
                        >
                          {resolvedTitle}
                        </h3>
                        <div className="yer-experiences__body">
                          <div className="yer-experiences__copy">
                            {renderRichText(resolvedBody, bodyStyleOverrides)}
                          </div>
                          {ctaValue ? (
                            <div className="yer-experiences__cta">
                              <ComprehensiveCTA value={ctaValue} />
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </EntityField>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailExperiencesSection: YextComponentConfig<ExperiencesProps> =
  {
    label: "Experiences Section",
    fields: experiencesFields,
    resolveFields: (data) => {
      const fields = toPuckFields(experiencesFields) as any;
      const variant = data.props.cardStyles?.ctaStyles?.variant;

      return {
        ...fields,
        cardStyles: {
          ...fields.cardStyles,
          objectFields: {
            ...fields.cardStyles.objectFields,
            ctaStyles: {
              ...fields.cardStyles.objectFields.ctaStyles,
              objectFields: {
                ...fields.cardStyles.objectFields.ctaStyles.objectFields,
                button: {
                  ...fields.cardStyles.objectFields.ctaStyles.objectFields
                    .button,
                  visible: variant !== "link",
                },
                link: {
                  ...fields.cardStyles.objectFields.ctaStyles.objectFields.link,
                  visible: variant === "link",
                },
              },
            },
          },
        },
      };
    },
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Featured Shopping Experiences",
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
      cardStyles: {
        image: {
          aspectRatio: 1,
          imageConstrain: "filled",
          styles: {
            borderRadius: "default",
          },
        },
        headingTextStyles: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        descriptionTextStyles: {
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        ctaStyles: {
          variant: "primary",
          button: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            borderRadius: "default",
            letterSpacing: "default",
          },
          link: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            includeCaret: "default",
          },
        },
      },
      cards: experienceCardsSource.defaultValue,
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
    },
    render: EssentialRetailExperiencesSectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailExperiencesSection",
  displayName: "Experiences Section",
  description: "Experiences Section",
  pageSetTypes: ["ENTITY"],
};

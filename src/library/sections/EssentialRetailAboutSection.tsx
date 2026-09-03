import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  EntityField,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  ThemeOptions,
  toPuckFields,
  useDocument,
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

const aboutTypographyScopeClass = "yer-about-typography";

const aboutTypographyStyles = `
  .${aboutTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${aboutTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${aboutTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${aboutTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${aboutTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${aboutTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${aboutTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${aboutTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${aboutTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${aboutTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${aboutTypographyScopeClass} a:not(.font-button-fontFamily):hover {
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

type AboutProps = {
  heading: StyledTextProps;
  body: StyledRtfProps;
  aboutImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
  };
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

const aboutFields: YextFields<AboutProps> = {
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
  aboutImage: {
    label: "About Image",
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
};

export const EssentialRetailAboutSectionComponent: PuckComponent<
  AboutProps
> = ({ id, heading, body, aboutImage, section, puck }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailAboutSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedImage = resolveComponentData(
    aboutImage.image,
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
          className={`${aboutTypographyScopeClass} yer-about${hasResolvedImage ? "" : " yer-about--no-image"}`}
          as="section"
          background={section.backgroundColor}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
                .yer-about {
                  display: grid;
                  grid-template-columns: minmax(0, 1fr);
                  overflow: hidden;
                }

                .yer-about__content {
                  order: 1;
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  justify-content: flex-start;
                  padding: 40px 15px;
                }

                .yer-about__heading {
                  margin: 0;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-about__body p + p {
                  margin-top: 8px;
                }

                .yer-about__media {
                  margin: 0;
                  width: 100%;
                  aspect-ratio: 391 / 200;
                  overflow: hidden;
                }

                .yer-about__mediaWrapper {
                  order: 2;
                  min-width: 0;
                }

                .yer-about__image {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }

                @media (min-width: 768px) {
                  .yer-about__content {
                    padding-right: 32px;
                    padding-left: 32px;
                  }

                  .yer-about__media {
                    aspect-ratio: 768 / 400;
                  }
                }

                @media (min-width: 990px) {
                  .yer-about {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                  }

                  .yer-about--no-image {
                    grid-template-columns: minmax(0, 1fr);
                  }

                  .yer-about--no-image .yer-about__content {
                    width: 100%;
                    max-width: 1440px;
                    margin: 0 auto;
                  }

                  .yer-about__content {
                    order: 0;
                    justify-content: center;
                    padding: 80px;
                  }

                  .yer-about__media {
                    aspect-ratio: auto;
                    min-height: 100%;
                    height: 100%;
                  }

                  .yer-about__mediaWrapper {
                    order: 0;
                  }
                }
              `}
          </style>
          <style>{aboutTypographyStyles}</style>
          <div className="yer-about__content">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
                className="yer-about__heading"
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
              <div className="yer-about__body">
                {typeof resolvedBody === "string" ? (
                  <MaybeRTF
                    data={resolvedBody}
                    richTextStyleOverrides={bodyOverrides}
                  />
                ) : (
                  resolvedBody
                )}
              </div>
            </EntityField>
          </div>
          {(() => {
            if (!hasResolvedImage || !resolvedImage) {
              return null;
            }

            return (
              <div className="yer-about__mediaWrapper">
                <EntityField
                  displayName="About Image"
                  fieldId={aboutImage.image.field}
                  constantValueEnabled={aboutImage.image.constantValueEnabled}
                >
                  <figure
                    className="yer-about__media"
                    style={{ aspectRatio: aboutImage.aspectRatio }}
                  >
                    <Image
                      image={resolvedImage}
                      className="yer-about__image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit:
                          aboutImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                      }}
                    />
                  </figure>
                </EntityField>
              </div>
            );
          })()}
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailAboutSection: YextComponentConfig<AboutProps> =
  {
    label: "About Section",
    fields: toPuckFields(aboutFields),
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "About This Store",
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
            defaultValue: {
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[[name]] - [[address.city]] is located at [[address.line1]] and serves [[address.city]]\'s diverse neighborhoods. Our flagship offers an elevated shopping experience, combining high-tech convenience with personalized boutique service.\\n\\nThe store features modern, spacious fitting rooms with adjustable lighting, a lounge area for companions, and seamless mobile checkout to save you time.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>[[name]] - [[address.city]] is located at [[address.line1]] and serves [[address.city]]&#39;s diverse neighborhoods. Our flagship offers an elevated shopping experience, combining high-tech convenience with personalized boutique service.\n\nThe store features modern, spacious fitting rooms with adjustable lighting, a lounge area for companions, and seamless mobile checkout to save you time.</span></p>',
            },
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
      aboutImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
      },
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
      },
    },
    render: EssentialRetailAboutSectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailAboutSection",
  displayName: "About Section",
  description: "About Section",
  pageSetTypes: ["ENTITY"],
};

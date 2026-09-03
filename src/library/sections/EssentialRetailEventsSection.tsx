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
  resolveComponentData,
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

const eventsTypographyScopeClass = "yer-events-typography";

const eventsTypographyStyles = `
  .${eventsTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${eventsTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${eventsTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${eventsTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${eventsTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${eventsTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${eventsTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${eventsTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${eventsTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${eventsTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${eventsTypographyScopeClass} a:not(.font-button-fontFamily):hover {
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

type EventsProps = {
  backgroundImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  cta: ComprehensiveCTAValue;
  section: {
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

const eventsFields: YextFields<EventsProps> = {
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
    },
  },
  backgroundImage: {
    label: "Background Image",
    type: "object",
    objectFields: {
      image: {
        type: "entityField",
        label: "Image",
        filter: { types: ["type.image"] },
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

export const EssentialRetailEventsSectionComponent: PuckComponent<
  EventsProps
> = ({ id, backgroundImage, heading, body, cta, section, puck }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextEssentialRetailEventsSection${getAnalyticsScopeHash(id)}`;
  const resolvedImage = resolveComponentData(
    backgroundImage.image,
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
          className={`yer-events ${eventsTypographyScopeClass}`}
          as="section"
          background={{ selectedColor: "black", contrastingColor: "white" }}
          style={getSurfaceColorStyle(
            { selectedColor: "black", contrastingColor: "white" },
            streamDocument,
          )}
        >
          <style>
            {`
                .yer-events {
                  position: relative;
                  overflow: hidden;
                }

                .yer-events__background,
                .yer-events__overlay {
                  position: absolute;
                  inset: 0;
                }

                .yer-events__background {
                  z-index: 0;
                }

                .yer-events__image {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }

                .yer-events__overlay {
                  z-index: 1;
                  background: rgba(0, 0, 0, 0.65);
                }

                .yer-events__inner {
                  position: relative;
                  z-index: 2;
                  max-width: 1440px;
                  margin: 0 auto;
                  padding: 40px 15px;
                }

                .yer-events__content {
                  max-width: 520px;
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                }

                .yer-events__heading {
                  margin: 0;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-events__actions {
                  padding-top: 16px;
                }

                @media (min-width: 768px) {
                  .yer-events__inner {
                    padding-right: 32px;
                    padding-left: 32px;
                  }
                }

                @media (max-width: 989px) {
                  .yer-events__background > *,
                  .yer-events__background > * > * {
                    display: block;
                    width: 100%;
                    height: 100%;
                  }
                }

                @media (min-width: 990px) {
                  .yer-events__inner {
                    padding: 80px 60px;
                  }
                }
              `}
          </style>
          <style>{eventsTypographyStyles}</style>
          <div className="yer-events__background">
            {hasResolvedImage && resolvedImage ? (
              <EntityField
                displayName="Background Image"
                fieldId={backgroundImage.image.field}
                constantValueEnabled={
                  backgroundImage.image.constantValueEnabled
                }
              >
                <Image
                  image={resolvedImage}
                  className="yer-events__image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </EntityField>
            ) : null}
          </div>
          <div className="yer-events__overlay" />
          <div className="yer-events__inner">
            <div className="yer-events__content">
              <EntityField
                displayName="Heading"
                fieldId={heading.text.field}
                constantValueEnabled={heading.text.constantValueEnabled}
              >
                <h2
                  className="yer-events__heading"
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
              <div className="yer-events__actions">
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
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailEventsSection: YextComponentConfig<EventsProps> =
  {
    label: "Events Section",
    fields: toPuckFields(eventsFields),
    defaultProps: {
      backgroundImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Community & Events",
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
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[[name]] - [[address.city]] hosts monthly \\"Style & Sip\\" events and seasonal trend previews. Join our local mailing list to receive invitations to private shopping nights and early access to sales.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>[[name]] - [[address.city]] hosts monthly &#34;Style &amp; Sip&#34; events and seasonal trend previews. Join our local mailing list to receive invitations to private shopping nights and early access to sales.</span></p>',
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
      cta: makeCtaValue("Join Mailing List", "#", "primaryCta"),
      section: {
        visibleOnLivePage: true,
      },
    },
    render: EssentialRetailEventsSectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailEventsSection",
  displayName: "Events Section",
  description: "Events Section",
  pageSetTypes: ["ENTITY"],
};

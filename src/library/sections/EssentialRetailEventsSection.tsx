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
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
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
  createCtaValue,
  getRichTextStyleOverrides,
  getScopedTypographyStyles,
  getTextStyle,
  hasImageSource,
  renderRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

const eventsTypographyScopeClass = "yer-events-typography";

const eventsTypographyStyles = getScopedTypographyStyles(
  eventsTypographyScopeClass,
);

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

const eventsFields: YextFields<EventsProps> = {
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
    },
  },
  backgroundImage: {
    label: msg("fields.backgroundImage", "Background Image"),
    type: "object",
    objectFields: {
      image: {
        type: "entityField",
        label: msg("fields.image", "Image"),
        filter: { types: ["type.image"] },
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
    fields: eventsFields,
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
      cta: createCtaValue({
        label: "Join Mailing List",
        link: "#",
        eventName: "primaryCta",
      }),
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

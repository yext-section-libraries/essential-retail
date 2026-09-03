import type { SectionConfig } from "@yext/visual-editor";

import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  MapboxStaticMapComponent,
  mapboxStaticMapStyleOptions,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  toPuckFields,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  type ComprehensiveCTAValue,
} from "@yext/visual-editor";
import { Address, AnalyticsScopeProvider, Link } from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";

const nearbyTypographyScopeClass = "yer-nearby-typography";

const nearbyTypographyStyles = `
  .${nearbyTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${nearbyTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${nearbyTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${nearbyTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${nearbyTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${nearbyTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${nearbyTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${nearbyTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${nearbyTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${nearbyTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${nearbyTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
  .${nearbyTypographyScopeClass} .yer-nearby__cardBody,
  .${nearbyTypographyScopeClass} .yer-nearby__distance {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${nearbyTypographyScopeClass} .yer-nearby__cardBody address,
  .${nearbyTypographyScopeClass} .yer-nearby__cardBody div,
  .${nearbyTypographyScopeClass} .yer-nearby__cardBody span {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
    font-style: inherit;
    text-transform: inherit;
  }
`;

type CoordinateValue = {
  latitude?: number;
  longitude?: number;
};

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type NearbyTextStylesProps = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type NearbyLocationCardStyles = {
  headingTextStyles: NearbyTextStylesProps;
  bodyTextStyles: NearbyTextStylesProps;
  address: {
    showRegion: boolean;
    showCountry: boolean;
  };
  phone: {
    phoneFormat: "international" | "domestic";
  };
  ctaStyles: {
    variant: "primary" | "secondary" | "link";
    color?: ThemeColor;
  };
};

type NearbyProps = {
  heading: StyledTextProps;
  cardStyles: NearbyLocationCardStyles;
  map: {
    coordinate: YextEntityField<CoordinateValue>;
    mapStyle: string;
    zoom: number;
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

const nearbyFields: YextFields<NearbyProps> = {
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
  cardStyles: {
    label: "Nearby Location Styles",
    type: "object",
    objectFields: {
      headingTextStyles: {
        label: "Heading Text Styles",
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
      address: {
        label: "Address",
        type: "object",
        objectFields: {
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
      phone: {
        label: "Phone",
        type: "object",
        objectFields: {
          phoneFormat: {
            label: "Phone Number Format",
            type: "radio",
            options: [
              { label: "Domestic", value: "domestic" },
              { label: "International", value: "international" },
            ],
          },
        },
      },
      ctaStyles: {
        label: "Call to Action Styles",
        type: "object",
        objectFields: {
          variant: {
            label: "Variant",
            type: "radio",
            options: [
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Link", value: "link" },
            ],
          },
          color: {
            label: "Color",
            type: "basicSelector",
            options: "SITE_COLOR",
          },
        },
      },
    },
  },
  map: {
    label: "Map",
    type: "object",
    objectFields: {
      coordinate: {
        type: "entityField",
        label: "Coordinates",
        filter: { types: ["type.coordinate"] },
      },
      mapStyle: {
        label: "Mapbox Map Style",
        type: "select",
        options: mapboxStaticMapStyleOptions,
      },
      zoom: {
        label: "Zoom",
        type: "number",
        min: 0,
        max: 22,
      },
    },
  },
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceMiles = (
  from?: CoordinateValue,
  to?: CoordinateValue,
) => {
  if (
    from?.latitude === undefined ||
    from.longitude === undefined ||
    to?.latitude === undefined ||
    to.longitude === undefined
  ) {
    return null;
  }

  const earthRadiusMi = 3958.8;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusMi * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatPhoneNumber = (
  phoneNumber: string | undefined,
  format: "international" | "domestic",
) => {
  if (!phoneNumber) {
    return "";
  }

  const cleaned = phoneNumber.replace(/(?!^\+)\+|[^\d+]/g, "");
  const parsed = parsePhoneNumber(cleaned);

  if (!parsed.valid || !parsed.number) {
    return phoneNumber;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const makeNearbyCtaValue = (
  link: string,
  styles: NearbyLocationCardStyles["ctaStyles"],
  eventName: string,
): Partial<ComprehensiveCTAValue> => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        label: "Get Directions",
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
    variant: styles.variant,
    color: styles.color,
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
  eventName,
});

export const EssentialRetailNearbySectionComponent: PuckComponent<
  NearbyProps
> = ({ id, heading, cardStyles, map, section, puck }) => {
  const streamDocument = useDocument<Record<string, unknown>>();
  const locale =
    typeof streamDocument.locale === "string" ? streamDocument.locale : "en";
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const scopeName = `YextEssentialRetailNearbySection${getAnalyticsScopeHash(id)}`;
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const resolvedCoordinate = resolveComponentData(
    map.coordinate,
    locale,
    streamDocument,
  );
  const originCoordinate = resolvedCoordinate ?? {
    latitude: (
      streamDocument.yextDisplayCoordinate as CoordinateValue | undefined
    )?.latitude,
    longitude: (
      streamDocument.yextDisplayCoordinate as CoordinateValue | undefined
    )?.longitude,
  };
  const nearbyQuery = useNearbyLocations({
    streamDocument,
    latitude: originCoordinate?.latitude,
    longitude: originCoordinate?.longitude,
    radiusMi: 25,
    limit: 4,
    enabled:
      typeof originCoordinate?.latitude === "number" &&
      typeof originCoordinate?.longitude === "number",
  });
  const currentLocationId =
    typeof streamDocument.id === "string" ? streamDocument.id : undefined;
  const nearbyDocs = (nearbyQuery.data?.response?.docs ?? [])
    .filter((doc) => !currentLocationId || doc.id !== currentLocationId)
    .slice(0, 3);
  const hasMapImage = Boolean(
    map.coordinate &&
    typeof originCoordinate?.latitude === "number" &&
    typeof originCoordinate?.longitude === "number",
  );
  const nearbyLocationHeadingStyle = buildTextStyle(
    cardStyles.headingTextStyles.styles,
    {
      family: "var(--fontFamily-h3-fontFamily)",
      size: "var(--fontSize-h3-fontSize)",
      weight: "var(--fontWeight-h3-fontWeight)",
      transform: "var(--textTransform-h3-textTransform)",
    },
    cardStyles.headingTextStyles.fontColor,
  );
  const nearbyLocationBodyStyle = buildTextStyle(
    cardStyles.bodyTextStyles.styles,
    {
      family: "var(--fontFamily-body-fontFamily)",
      size: "var(--fontSize-body-fontSize)",
      weight: "var(--fontWeight-body-fontWeight)",
      transform: "var(--textTransform-body-textTransform)",
    },
    cardStyles.bodyTextStyles.fontColor,
  );

  if (nearbyDocs.length === 0 && !puck.isEditing) {
    return <></>;
  }

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          className={`yer-nearby ${nearbyTypographyScopeClass}`}
          as="section"
          background={section.backgroundColor}
          style={getSurfaceColorStyle(section.backgroundColor, streamDocument)}
        >
          <style>
            {`
                .yer-nearby {
                  padding: 40px 0;
                }

                .yer-nearby__inner {
                  max-width: 1440px;
                  margin: 0 auto;
                  padding: 0 15px;
                }

                .yer-nearby__heading {
                  margin: 0;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-nearby__mapFrame {
                  margin-top: 32px;
                  width: 100%;
                  aspect-ratio: 2754 / 994;
                  overflow: hidden;
                  background: rgba(255, 255, 255, 0.06);
                }

                .yer-nearby__mapFrame .mapbox-static-map-shell,
                .yer-nearby__mapFrame .mapbox-static-map-picture,
                .yer-nearby__mapFrame .mapbox-static-map-image {
                  width: 100%;
                  height: 100%;
                }

                .yer-nearby__mapFrame .mapbox-static-map-image {
                  object-fit: cover;
                  object-position: center;
                }

                .yer-nearby__mapPlaceholder {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  height: 100%;
                  padding: 24px;
                  text-align: center;
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: 16px;
                  line-height: 1.2;
                }

                .yer-nearby__grid {
                  display: grid;
                  grid-template-columns: 1fr;
                  gap: 32px;
                  margin-top: 32px;
                }

                .yer-nearby__cardTitle {
                  margin: 0 0 24px;
                  font-family: var(--fontFamily-h3-fontFamily);
                  font-size: 20px;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-nearby__cardTitleLink {
                  color: inherit;
                  text-decoration: none;
                }

                .yer-nearby__cardTitleLink:hover,
                .yer-nearby__cardTitleLink:focus-visible {
                  opacity: 0.7;
                }

                .yer-nearby__cardBody {
                  font-size: 20px;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-nearby__distance {
                  margin-top: 12px;
                  font-family: var(--fontFamily-h3-fontFamily);
                  font-size: 16px;
                  line-height: 1.2;
                }

                .yer-nearby__cta {
                  margin-top: 24px;
                  min-width: 0;
                  max-width: 100%;
                }

                .yer-nearby__empty {
                  margin: 32px 0 0;
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: 16px;
                  line-height: 1.2;
                }

                @media (min-width: 768px) {
                  .yer-nearby__inner {
                    padding-right: 32px;
                    padding-left: 32px;
                  }
                }

                @media (min-width: 990px) {
                  .yer-nearby {
                    padding: 80px 0;
                  }

                  .yer-nearby__inner {
                    padding-right: 60px;
                    padding-left: 60px;
                  }

                  .yer-nearby__grid {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                  }
                }
              `}
          </style>
          <style>{nearbyTypographyStyles}</style>
          <div className="yer-nearby__inner">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
                className="yer-nearby__heading"
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
            {hasMapImage || puck.isEditing ? (
              <EntityField
                displayName="Map"
                fieldId={map.coordinate.field}
                constantValueEnabled={map.coordinate.constantValueEnabled}
              >
                <figure className="yer-nearby__mapFrame">
                  {hasMapImage ? (
                    <MapboxStaticMapComponent
                      id={`${id}-map`}
                      coordinate={{
                        field: map.coordinate.field,
                        constantValue: {
                          latitude: originCoordinate?.latitude ?? 0,
                          longitude: originCoordinate?.longitude ?? 0,
                        },
                        constantValueEnabled: true,
                      }}
                      mapStyle={map.mapStyle}
                      zoom={map.zoom}
                      height="100%"
                      puck={puck}
                    />
                  ) : (
                    <div className="yer-nearby__mapPlaceholder">
                      Add the Mapbox env var to render the nearby store map.
                    </div>
                  )}
                </figure>
              </EntityField>
            ) : (
              <></>
            )}
            {nearbyDocs.length > 0 ? (
              <div className="yer-nearby__grid">
                {nearbyDocs.map((doc, index) => {
                  const destinationCoordinate =
                    doc.yextDisplayCoordinate ?? doc.geocodedCoordinate;
                  const distance = calculateDistanceMiles(
                    originCoordinate,
                    destinationCoordinate,
                  );
                  const resolvedUrl = resolveUrlTemplate(
                    mergeMeta(doc, streamDocument),
                    relativePrefixToRoot ?? "",
                  );
                  const ctaValue = makeNearbyCtaValue(
                    resolvedUrl,
                    cardStyles.ctaStyles,
                    `nearbyLink${index}`,
                  );

                  return (
                    <article key={doc.id ?? index}>
                      <h3
                        className="yer-nearby__cardTitle"
                        style={nearbyLocationHeadingStyle}
                      >
                        <Link
                          href={resolvedUrl}
                          className="yer-nearby__cardTitleLink"
                          eventName={`nearbyTitle${index}`}
                          style={nearbyLocationHeadingStyle}
                        >
                          {doc.name ?? "Nearby Location"}
                        </Link>
                      </h3>
                      {doc.address ? (
                        <div
                          className="yer-nearby__cardBody"
                          style={nearbyLocationBodyStyle}
                        >
                          <Address
                            address={doc.address}
                            showRegion={cardStyles.address.showRegion}
                            showCountry={cardStyles.address.showCountry}
                          />
                        </div>
                      ) : null}
                      {doc.mainPhone ? (
                        <p
                          className="yer-nearby__cardBody"
                          style={nearbyLocationBodyStyle}
                        >
                          {formatPhoneNumber(
                            doc.mainPhone,
                            cardStyles.phone.phoneFormat,
                          )}
                        </p>
                      ) : null}
                      {distance ? (
                        <p
                          className="yer-nearby__distance"
                          style={nearbyLocationBodyStyle}
                        >
                          {`Located ${distance.toFixed(1)} miles from ${streamDocument.name ?? "this location"}`}
                        </p>
                      ) : null}
                      <div className="yer-nearby__cta">
                        <ComprehensiveCTA value={ctaValue} />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : puck.isEditing ? (
              <p className="yer-nearby__empty">
                Nearby locations will appear here when sibling location data is
                available.
              </p>
            ) : (
              <></>
            )}
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailNearbySection: YextComponentConfig<NearbyProps> =
  {
    label: "Nearby Section",
    fields: toPuckFields(nearbyFields),
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Nearby Stores",
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
        address: {
          showRegion: true,
          showCountry: false,
        },
        phone: {
          phoneFormat: "domestic",
        },
        ctaStyles: {
          variant: "secondary",
          color: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
        },
      },
      map: {
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 0,
            longitude: 0,
          },
          constantValueEnabled: false,
        },
        mapStyle: "streets-v12",
        zoom: 11,
      },
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
      },
    },
    render: EssentialRetailNearbySectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailNearbySection",
  displayName: "Nearby Section",
  description: "Nearby Section",
  pageSetTypes: ["ENTITY"],
};

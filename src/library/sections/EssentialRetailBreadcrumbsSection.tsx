import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveBreadcrumbs,
  resolveComponentData,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  useDocument,
  useTemplateProps,
  VisibilityWrapper,
} from "@yext/visual-editor";

type BreadcrumbsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: YextEntityField<TranslatableString>;
  textStyles: StyledTextValue;
  fontColor?: ThemeColor;
  includeCurrentLocation: boolean;
};

const breadcrumbsFields: YextFields<BreadcrumbsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
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
  rootLabel: {
    label: "Root Label",
    type: "entityField",
    filter: { types: ["type.string"] },
  },
  textStyles: {
    label: "Text Styles",
    type: "styledText",
  },
  fontColor: {
    label: "Font Color",
    type: "basicSelector",
    options: "SITE_COLOR",
  },
  includeCurrentLocation: {
    label: "Include Current Location",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};

const breadcrumbsStyles = String.raw`
.yer-breadcrumbs {
  padding: 14px 28px;
  font-family: var(--fontFamily-body-fontFamily);
}
.yer-breadcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.yer-breadcrumbs__link {
  color: inherit;
  text-decoration: none;
}
.yer-breadcrumbs__link:hover,
.yer-breadcrumbs__link:focus-visible {
  text-decoration: underline;
}
.yer-breadcrumbs__separator {
  opacity: 0.65;
}
.yer-breadcrumbs__current {
  opacity: 0.82;
}
@media (max-width: 640px) {
  .yer-breadcrumbs { padding: 12px 20px; }
}
`;

const EssentialRetailBreadcrumbsSectionComponent: PuckComponent<
  BreadcrumbsProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const breadcrumbs = resolveBreadcrumbs(streamDocument);
  const rootLabel = resolveComponentData(
    props.rootLabel,
    locale,
    streamDocument,
  );
  const currentLocationLabel = streamDocument.name ?? "";
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const textStyle: React.CSSProperties = {
    color:
      getThemeColorCssValue(props.fontColor) ??
      getThemeColorCssValue(props.section.backgroundColor.contrastingColor),
    fontFamily:
      props.textStyles.fontFamily === "default"
        ? undefined
        : props.textStyles.fontFamily,
    fontSize:
      props.textStyles.fontSize === "default"
        ? undefined
        : props.textStyles.fontSize,
    fontStyle:
      props.textStyles.fontStyle === "default"
        ? undefined
        : props.textStyles.fontStyle,
    fontWeight:
      props.textStyles.fontWeight === "default"
        ? undefined
        : props.textStyles.fontWeight,
    textTransform:
      props.textStyles.textTransform === "default"
        ? undefined
        : props.textStyles.textTransform,
  };
  const visibleBreadcrumbs =
    props.includeCurrentLocation || breadcrumbs.length <= 1
      ? breadcrumbs
      : breadcrumbs.slice(0, -1);

  if (!visibleBreadcrumbs.length) {
    return props.puck.isEditing ? (
      <p
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        No breadcrumbs available (section will be hidden on live page). Create a
        directory to enable breadcrumbs.
      </p>
    ) : (
      <></>
    );
  }

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <>
        <style>{breadcrumbsStyles}</style>
        <Background
          as="nav"
          aria-label="Breadcrumbs"
          background={props.section.backgroundColor}
          className="yer-breadcrumbs"
          style={sectionSurfaceStyle}
        >
          <ol className="yer-breadcrumbs__list" style={textStyle}>
            {visibleBreadcrumbs.map(({ name, slug }, breadcrumbIndex) => {
              const isRoot = breadcrumbIndex === 0;
              const isCurrentLocation =
                props.includeCurrentLocation &&
                breadcrumbIndex === visibleBreadcrumbs.length - 1;
              const label = isCurrentLocation
                ? currentLocationLabel || name
                : isRoot && rootLabel
                  ? rootLabel
                  : name;
              const href = relativePrefixToRoot
                ? relativePrefixToRoot + slug
                : slug;
              const breadcrumbContent = isCurrentLocation ? (
                <span aria-current="page" className="yer-breadcrumbs__current">
                  {label}
                </span>
              ) : (
                <Link
                  className="yer-breadcrumbs__link"
                  eventName={`breadcrumb${breadcrumbIndex}`}
                  href={href}
                >
                  {label}
                </Link>
              );

              return (
                <React.Fragment key={`${slug}-${breadcrumbIndex}`}>
                  {breadcrumbIndex > 0 && (
                    <li
                      aria-hidden="true"
                      className="yer-breadcrumbs__separator"
                    >
                      /
                    </li>
                  )}
                  <li>
                    {isRoot && !isCurrentLocation ? (
                      <EntityField
                        displayName="Root Label"
                        fieldId={props.rootLabel.field}
                        constantValueEnabled={
                          props.rootLabel.constantValueEnabled
                        }
                      >
                        {breadcrumbContent}
                      </EntityField>
                    ) : (
                      breadcrumbContent
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </Background>
      </>
    </VisibilityWrapper>
  );
};

export const EssentialRetailBreadcrumbsSection: YextComponentConfig<BreadcrumbsProps> =
  {
    label: "Breadcrumbs Section",
    fields: breadcrumbsFields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
        visibleOnLivePage: true,
      },
      rootLabel: {
        field: "",
        constantValue: { defaultValue: "All Locations" },
        constantValueEnabled: true,
      },
      textStyles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      fontColor: undefined,
      includeCurrentLocation: true,
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`EssentialRetailBreadcrumbsSection${getAnalyticsScopeHash(props.id)}`}
      >
        <EssentialRetailBreadcrumbsSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "EssentialRetailBreadcrumbsSection",
  displayName: "Breadcrumbs Section",
  description: "Breadcrumbs Section",
  pageSetTypes: ["ENTITY"],
};

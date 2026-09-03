import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { type PuckComponent } from "@puckeditor/core";
import {
  Background,
  EntityField,
  VisibilityWrapper,
  getAggregateRating,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  ReviewStars,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

const reviewsTypographyScopeClass = "yer-reviews-typography";

const reviewsTypographyStyles = `
  .${reviewsTypographyScopeClass} {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${reviewsTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${reviewsTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${reviewsTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${reviewsTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${reviewsTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${reviewsTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${reviewsTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${reviewsTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${reviewsTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${reviewsTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type ReviewTextStylesProps = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type ReviewRecord = Record<string, unknown>;

type ReviewsProps = {
  heading: StyledTextProps;
  reviewHeadingStyles: ReviewTextStylesProps;
  reviewBodyStyles: ReviewTextStylesProps;
  reviewStarColor?: ThemeColor;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const REVIEW_PUBLISHER_VALUE = "FIRSTPARTY" as const;

const fallbackReviews: ReviewRecord[] = [
  {
    authorName: "Jordan Lee",
    rating: 5,
    content:
      "The styling team made it easy to find exactly what I needed. The store was clean, organized, and welcoming.",
  },
  {
    authorName: "Maya Patel",
    rating: 5,
    content:
      "Great service and a beautiful selection. I found several pieces that worked perfectly for my event.",
  },
  {
    authorName: "Chris Morgan",
    rating: 4,
    content:
      "Helpful associates, quick checkout, and a relaxed shopping experience. I will definitely come back.",
  },
];

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

const reviewsFields: YextFields<ReviewsProps> = {
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
  reviewHeadingStyles: {
    label: "Review Heading Styles",
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
  reviewBodyStyles: {
    label: "Review Body Styles",
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
  reviewStarColor: {
    label: "Review Star Color",
    type: "basicSelector",
    options: "SITE_COLOR",
  },
};

const getReviewsArray = (document: Record<string, unknown>): ReviewRecord[] => {
  const aggregateReviews = document.ref_reviewsAgg;

  if (Array.isArray(aggregateReviews)) {
    const firstPartyAggregate = aggregateReviews.find(
      (item) =>
        item &&
        typeof item === "object" &&
        (item as Record<string, unknown>).publisher === REVIEW_PUBLISHER_VALUE,
    );
    const topReviews: unknown[] =
      firstPartyAggregate &&
      typeof firstPartyAggregate === "object" &&
      Array.isArray(
        (firstPartyAggregate as { topReviews?: unknown[] }).topReviews,
      )
        ? ((firstPartyAggregate as { topReviews?: unknown[] }).topReviews ?? [])
        : [];

    return topReviews.filter(
      (item): item is ReviewRecord => typeof item === "object" && item !== null,
    );
  }

  return [];
};

const getReviewText = (review: ReviewRecord) => {
  const candidates = [
    review.reviewText,
    review.comment,
    review.text,
    review.body,
    review.content,
  ];

  const match = candidates.find((value) => typeof value === "string");
  return typeof match === "string" ? match.trim() : "";
};

const getReviewAuthor = (review: ReviewRecord) => {
  const directCandidates = [
    review.authorName,
    review.reviewerName,
    review.author,
    review.name,
    review.publisher,
  ];
  const directMatch = directCandidates.find(
    (value) => typeof value === "string",
  );

  if (typeof directMatch === "string" && directMatch.trim()) {
    return directMatch.trim();
  }

  if (
    review.author &&
    typeof review.author === "object" &&
    typeof (review.author as { name?: string }).name === "string"
  ) {
    return ((review.author as { name?: string }).name ?? "").trim();
  }

  return "Customer";
};

const getReviewRating = (review: ReviewRecord) => {
  const candidates = [
    review.rating,
    review.reviewRating,
    review.score,
    review.stars,
  ];
  const match = candidates.find((value) => typeof value === "number");

  if (typeof match === "number" && Number.isFinite(match)) {
    return Math.max(0, Math.min(5, Math.round(match)));
  }

  if (
    review.rating &&
    typeof review.rating === "object" &&
    typeof (review.rating as { value?: number }).value === "number"
  ) {
    return Math.max(
      0,
      Math.min(5, Math.round((review.rating as { value?: number }).value ?? 0)),
    );
  }

  return 0;
};

export const EssentialRetailReviewsSectionComponent: PuckComponent<
  ReviewsProps
> = ({
  id,
  heading,
  reviewHeadingStyles,
  reviewBodyStyles,
  reviewStarColor,
  section,
  puck,
}) => {
  const streamDocument = useDocument<Record<string, unknown>>();
  const locale =
    typeof streamDocument.locale === "string" ? streamDocument.locale : "en";
  const scopeName = `YextEssentialRetailReviewsSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeading =
    resolveComponentData(heading.text, locale, streamDocument, {
      output: "plainText",
    }) ?? "";
  const aggregateRating = getAggregateRating(streamDocument) ?? {
    averageRating: 0,
    reviewCount: 0,
  };
  const reviews = getReviewsArray(streamDocument)
    .filter((item) => getReviewText(item))
    .slice(0, 3);
  const displayedReviews =
    reviews.length > 0 ? reviews : puck.isEditing ? fallbackReviews : [];
  const displayedRating =
    aggregateRating.averageRating > 0
      ? aggregateRating.averageRating
      : puck.isEditing
        ? 4.8
        : 0;
  const displayedReviewCount =
    aggregateRating.reviewCount > 0
      ? aggregateRating.reviewCount
      : puck.isEditing
        ? fallbackReviews.length
        : 0;
  const sectionSurfaceStyle = getSurfaceColorStyle(
    section.backgroundColor,
    streamDocument,
  );
  const reviewStarColorValue = getThemeColorCssValue(reviewStarColor);
  const reviewsSectionStyle = {
    ...sectionSurfaceStyle,
    ...(reviewStarColorValue
      ? { "--yer-reviews-star-color": reviewStarColorValue }
      : {}),
  } as React.CSSProperties;

  if (reviews.length === 0 && !puck.isEditing) {
    return <></>;
  }

  return (
    <VisibilityWrapper
      liveVisibility={section.visibleOnLivePage}
      isEditing={puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <Background
          className={`yer-reviews ${reviewsTypographyScopeClass}`}
          as="section"
          background={section.backgroundColor}
          style={reviewsSectionStyle}
        >
          <style>
            {`
                .yer-reviews {
                  padding: 40px 0;
                }

                .yer-reviews__inner {
                  max-width: 1440px;
                  margin: 0 auto;
                  padding: 0 15px;
                  display: flex;
                  flex-direction: column;
                  gap: 32px;
                }

                .yer-reviews__heading {
                  margin: 0;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-reviews__summary {
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  gap: 16px;
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: 20px;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                }

                .yer-reviews__reviewName {
                  white-space: nowrap;
                }

                .yer-reviews__stars {
                  gap: 6px;
                  color: var(--yer-reviews-star-color, currentColor);
                }

                .yer-reviews__list {
                  min-width: 0;
                }

                .yer-reviews__item {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  padding: 24px 0;
                  border-bottom: 1px solid currentColor;
                }

                .yer-reviews__reviewHeader {
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  gap: 16px;
                }

                .yer-reviews__reviewText {
                  margin: 0;
                  font-family: var(--fontFamily-h3-fontFamily);
                  font-size: 20px;
                  line-height: 1.2;
                  letter-spacing: 0.01em;
                  overflow-wrap: anywhere;
                }

                .yer-reviews__empty {
                  margin: 0;
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: 16px;
                }

                @media (min-width: 768px) {
                  .yer-reviews__inner {
                    padding-right: 32px;
                    padding-left: 32px;
                  }
                }

                @media (min-width: 990px) {
                  .yer-reviews {
                    padding: 80px 0;
                  }

                  .yer-reviews__inner {
                    padding-right: 60px;
                    padding-left: 60px;
                  }
                }
              `}
          </style>
          <style>{reviewsTypographyStyles}</style>
          <div className="yer-reviews__inner">
            <EntityField
              displayName="Heading"
              fieldId={heading.text.field}
              constantValueEnabled={heading.text.constantValueEnabled}
            >
              <h2
                className="yer-reviews__heading"
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
            {displayedReviewCount > 0 ? (
              <div
                className="yer-reviews__summary"
                aria-label={`Overall rating: ${displayedRating.toFixed(1)} out of 5 from ${displayedReviewCount} reviews`}
              >
                <ReviewStars
                  averageRating={displayedRating}
                  reviewCount={displayedReviewCount}
                  className="yer-reviews__stars"
                  color={reviewStarColor}
                />
              </div>
            ) : null}
            <div className="yer-reviews__list">
              {displayedReviews.length > 0 ? (
                displayedReviews.map((review, index) => {
                  const author = getReviewAuthor(review);
                  const reviewText = getReviewText(review);
                  const rating = getReviewRating(review);

                  return (
                    <article
                      key={`${author}-${index}`}
                      className="yer-reviews__item"
                    >
                      <div className="yer-reviews__reviewHeader">
                        <h3
                          className="yer-reviews__reviewName"
                          style={buildTextStyle(
                            reviewHeadingStyles.styles,
                            {
                              family: "var(--fontFamily-h3-fontFamily)",
                              size: "var(--fontSize-h3-fontSize)",
                              weight: "var(--fontWeight-h3-fontWeight)",
                              transform:
                                "var(--textTransform-h3-textTransform)",
                            },
                            reviewHeadingStyles.fontColor,
                          )}
                        >
                          {author}
                        </h3>
                        <ReviewStars
                          averageRating={rating}
                          className="yer-reviews__stars"
                          color={reviewStarColor}
                        />
                      </div>
                      <p
                        className="yer-reviews__reviewText"
                        style={buildTextStyle(
                          reviewBodyStyles.styles,
                          {
                            family: "var(--fontFamily-body-fontFamily)",
                            size: "var(--fontSize-body-fontSize)",
                            weight: "var(--fontWeight-body-fontWeight)",
                            transform:
                              "var(--textTransform-body-textTransform)",
                          },
                          reviewBodyStyles.fontColor,
                        )}
                      >
                        {reviewText}
                      </p>
                    </article>
                  );
                })
              ) : (
                <p className="yer-reviews__empty">
                  Reviews will appear here when first-party review data is
                  available.
                </p>
              )}
            </div>
          </div>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const EssentialRetailReviewsSection: YextComponentConfig<ReviewsProps> =
  {
    label: "Reviews Section",
    fields: toPuckFields(reviewsFields),
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "What Customers Are Saying",
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
      reviewHeadingStyles: {
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      reviewBodyStyles: {
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      reviewStarColor: undefined,
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
    },
    render: EssentialRetailReviewsSectionComponent,
  };

export const config: SectionConfig = {
  id: "EssentialRetailReviewsSection",
  displayName: "Reviews Section",
  description: "Reviews Section",
  pageSetTypes: ["ENTITY"],
};

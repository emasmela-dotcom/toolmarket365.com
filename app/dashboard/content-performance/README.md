# Content Performance Dashboard

Complete analytics system for tracking content performance, prediction accuracy, and ROI.

## Features

### Performance Tracking
- Real-time prediction vs actual comparison
- Multi-platform performance analysis
- Content type performance breakdown
- Engagement rate tracking
- Viral content identification

### Accuracy Analytics
- Prediction accuracy trends over time
- Confidence vs accuracy correlation
- Metric-specific accuracy breakdown (likes, comments, shares, views)
- Improvement recommendations
- High/low accuracy factor analysis

### Content Insights
- Personal content pattern analysis
- Winning content formula identification
- Optimal posting time recommendations
- Hashtag performance tracking
- Content recommendation engine

### A/B Testing
- Test creation and management
- Real-time test performance tracking
- Statistical significance calculations
- Winner determination and insights
- Test recommendation engine

### ROI Tracking
- Revenue attribution from predictions
- Cost vs benefit analysis
- Efficiency score calculations
- ROI trend analysis
- Monthly performance summaries

## Database Tables

The dashboard uses three main tables:

1. **content_performance** - Tracks predictions vs actual results
2. **ab_tests** - Manages A/B test experiments
3. **user_performance_metrics** - Aggregated user performance data

## API Endpoints

- `/api/dashboard/performance` - Performance data
- `/api/dashboard/accuracy` - Accuracy metrics
- `/api/dashboard/insights` - Content insights
- `/api/dashboard/ab-tests` - A/B test data

## Usage

1. Navigate to `/dashboard/content-performance`
2. Select time range and platform filters
3. View performance metrics across different tabs:
   - **Performance Overview** - Overall performance and trends
   - **Accuracy Tracking** - Prediction accuracy analysis
   - **Content Insights** - Personalized recommendations
   - **A/B Testing** - Test management and results
   - **ROI Analysis** - Revenue and efficiency tracking

## Integration

The dashboard automatically integrates with:
- Viral Content Predictor tool
- Content performance tracking
- User analytics

## Next Steps

To enable full functionality:
1. Run the database migration (add tables from `lib/schema.sql`)
2. Connect the dashboard to your viral predictor results
3. Set up actual performance data collection
4. Configure A/B testing workflows

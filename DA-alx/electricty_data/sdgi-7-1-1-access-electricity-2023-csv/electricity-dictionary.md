# Data Dictionary: SDG 7.1.1 Electricity Access Dataset

## Dataset Overview

- **Name**: sdgi711accesselectricity2023national.csv
- **Description**: National-level data on electricity access related to Sustainable Development Goal 7.1.1
- **Number of Records**: 256
- **Number of Variables**: 9
- **Geographic Coverage**: Global
- **Year**: 2023

## Variables

### Identification Variables

#### OID_

- **Description**: Unique identifier for each record
- **Type**: Integer
- **Example**: 1, 2, 3
- **Constraints**: Unique, Non-null
- **Usage**: Primary key for the dataset

#### ISO3

- **Description**: Three-letter country code following ISO 3166-1 alpha-3 standard
- **Type**: String
- **Example**: "USA", "GBR", "IND"
- **Length**: 3 characters
- **Constraints**: Unique, Non-null
- **Usage**: Standard country identifier for international comparison

#### NAME_0

- **Description**: Country or territory name
- **Type**: String
- **Example**: "United States", "United Kingdom"
- **Constraints**: Non-null
- **Usage**: Human-readable country identifier

### Population Variables

#### Total_Pop

- **Description**: Total population of the country
- **Type**: Float
- **Unit**: Thousands of people
- **Example**: 1463140.5 (represents 1.46 billion people)
- **Constraints**: > 0
- **Note**: Multiply by 1000 to get actual population

#### Pop_Elec

- **Description**: Population with access to electricity
- **Type**: Float
- **Unit**: Thousands of people
- **Example**: 1450509.4 (represents 1.45 billion people)
- **Constraints**: ≤ Total_Pop
- **Note**: Multiply by 1000 to get actual population

### Access Metrics

#### SDG711pct

- **Description**: Percentage of population with access to electricity
- **Type**: Float
- **Unit**: Percentage (0-100)
- **Example**: 98.5
- **Formula**: (Pop_Elec / Total_Pop) * 100
- **Usage**: Primary indicator for SDG 7.1.1

#### Pct_Error

- **Description**: Margin of error for the access percentage
- **Type**: Float
- **Unit**: Percentage points
- **Example**: 2.5
- **Usage**: Indicates uncertainty in SDG711pct measurement
- **Note**: Use for confidence interval calculations

### Geographic Attributes

#### Shape_Length

- **Description**: Length of the country's boundary
- **Type**: Float
- **Unit**: Degrees (geographic coordinates)
- **Usage**: Geographic Information System (GIS) attribute
- **Note**: Used for mapping purposes only

#### Shape_Area

- **Description**: Area of the country
- **Type**: Float
- **Unit**: Square degrees (geographic coordinates)
- **Usage**: Geographic Information System (GIS) attribute
- **Note**: Used for mapping purposes only

## Data Quality Notes

### Validation Rules

1. Population Consistency

   ```
   Pop_Elec ≤ Total_Pop
   SDG711pct = (Pop_Elec / Total_Pop) * 100
   ```

2. Range Constraints

   ```
   0 ≤ SDG711pct ≤ 100
   Pct_Error ≥ 0
   Total_Pop > 0
   ```

3. Geographic Constraints

   ```
   Shape_Length > 0
   Shape_Area > 0
   ```

### Missing Values

- No missing values allowed in key fields (OID_, ISO3, NAME_0)
- Population and access metrics should be complete
- Pct_Error may be null if uncertainty is not calculated

## Usage Guidelines

### Population Calculations

```
Actual Total Population = Total_Pop * 1000
Actual Population with Electricity = Pop_Elec * 1000
```

### Confidence Intervals

```
Lower Bound = SDG711pct - Pct_Error
Upper Bound = SDG711pct + Pct_Error
```

### Regional Analysis

- Use ISO3 codes for joining with other international datasets
- Consider population weights when calculating regional averages
- Account for Pct_Error when comparing countries

## Additional Notes

1. **Time Reference**
   - Data represents the most recent available estimates as of 2023
   - Different countries may have different base years for their estimates

2. **Geographic Coverage**
   - Includes sovereign states and some territories
   - Some small states or territories might be missing

3. **Data Sources**
   - Population data from national statistics offices
   - Electricity access data from national surveys and estimates
   - Geographic data from standard GIS sources

4. **Common Use Cases**
   - SDG 7.1.1 progress monitoring
   - National and regional electricity access comparisons
   - Population-weighted access calculations
   - Geographic analysis of access patterns

## Best Practices for Analysis

1. Always consider Pct_Error when making comparisons
2. Use population weights for regional aggregations
3. Report results with appropriate confidence intervals
4. Consider geographic attributes only for mapping purposes
5. Validate derived calculations against provided totals

# Data Dictionary: Water Access Analysis Dataset (2015-2020)

## Dataset Overview

- **Name**: estimates_of_the_use_of_water_(2015-2020).csv
- **Time Period**: 2015-2020
- **Description**: This dataset contains information about water access and usage across different countries, including urban and rural breakdowns.
- **Number of Records**: 464
- **Number of Variables**: 16

## Variables

### Identification Variables

#### name

- **Description**: Country or territory name
- **Type**: String
- **Example**: "Croatia"
- **Note**: Primary identifier for each country

#### year

- **Description**: Year of observation
- **Type**: Integer
- **Range**: 2015-2020
- **Example**: 2020

### Population Variables

#### pop_n

- **Description**: National population in thousands
- **Type**: Float
- **Unit**: Thousands of people
- **Example**: 4105.268066 (represents ~4.1 million people)
- **Note**: Contains decimal precision

#### pop_u

- **Description**: Urban population percentage
- **Type**: Float
- **Unit**: Percentage (stored as decimal)
- **Range**: 0-100
- **Example**: 57.55299759 (represents 57.55%)

### National Water Access Indicators

#### wat_bas_n

- **Description**: Percentage of national population with basic water access
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100
- **Note**: Basic water access means drinking water from an improved source within 30 minutes round trip

#### wat_lim_n

- **Description**: Percentage of national population with limited water access
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100
- **Note**: Limited access means more than 30 minutes round trip to collect water from an improved source

#### wat_unimp_n

- **Description**: Percentage of national population using unimproved water sources
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100
- **Note**: Unimproved sources include unprotected wells and springs

#### wat_sur_n

- **Description**: Percentage of national population using surface water
- **Type**: String
- **Unit**: Percentage
- **Range**: 0-100
- **Note**: Surface water includes rivers, dams, lakes, ponds, streams, canals, and irrigation channels

### Rural Water Access Indicators

#### wat_bas_r

- **Description**: Percentage of rural population with basic water access
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100

#### wat_lim_r

- **Description**: Percentage of rural population with limited water access
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100

#### wat_unimp_r

- **Description**: Percentage of rural population using unimproved water sources
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100

#### wat_sur_r

- **Description**: Percentage of rural population using surface water
- **Type**: String
- **Unit**: Percentage
- **Range**: 0-100

### Urban Water Access Indicators

#### wat_bas_u

- **Description**: Percentage of urban population with basic water access
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100

#### wat_lim_u

- **Description**: Percentage of urban population with limited water access
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100

#### wat_unimp_u

- **Description**: Percentage of urban population using unimproved water sources
- **Type**: Float
- **Unit**: Percentage
- **Range**: 0-100

#### wat_sur_u

- **Description**: Percentage of urban population using surface water
- **Type**: String
- **Unit**: Percentage
- **Range**: 0-100

## Data Quality Notes

1. **Missing Values**
   - Some countries may have incomplete data for certain indicators
   - Missing values are represented as "null"

2. **Percentage Totals**
   - For each geographic level (national, rural, urban), the four water access categories (basic, limited, unimproved, surface) should sum to 100%
   - Minor discrepancies may exist due to rounding

3. **Population Values**
   - Population numbers include decimal precision
   - Values are in thousands (multiply by 1000 for actual population)

4. **Time Series**
   - Data is available annually from 2015 to 2020
   - Not all countries may have data for all years

## Usage Guidelines

1. **Population Calculations**
   ```
   Actual Population = pop_n * 1000
   Urban Population = pop_n * (pop_u / 100) * 1000
   ```

2. **Percentage Handling**
   ```
   // Example: Converting stored value to display percentage
   Display Percentage = Original Value
   57.55299759 → 57.55%
   ```

3. **Data Validation**
   - Always check for null values before calculations
   - Verify percentage totals for consistency
   - Cross-reference urban/rural populations with national totals

## Source Information
- **Primary Source**: WHO/UNICEF Joint Monitoring Programme (JMP) for Water Supply, Sanitation and Hygiene
- **Dataset URL**: https://washdata.org/data
- **Last Updated**: 2020
- **Publisher**: World Health Organization (WHO) and United Nations Children's Fund (UNICEF)
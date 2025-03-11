import all from "mssql";

class Validation {
  static number({ name, value }) {
    //if (value) throw new Error(`${name} is required`);         //throws error in save functions
    if (value == null) throw new Error(`${name} is required`);
    if (typeof value !== "number") throw new Error(`${name} must be a number`);
  }

  static fieldName({ name }) {
    if (!name) throw new Error(`Field name is required`);
    if (typeof name !== "string")
      throw new Error(`Field name must be a string`);
  }

  static intNumber = ({ name, value }) => {
    this.number({ name, value });
    if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`);
  };

  static unsignedIntNumber = ({ name, value }) => {
    this.intNumber({ name, value });
    if (value < 0) throw new Error(`${name} must be a positive number`);
  };

  static entityId({ name, value }) {
    this.unsignedIntNumber({ name, value });
  }

  static stringValue = ({ name, value }) => {
    this.fieldName({ name });
    if (typeof value !== "string") throw new Error(`${name} must be a string`);
  };

  static floatValue = ({ name, value }) => {
    this.fieldName({ name });
    if (typeof value !== "number") throw new Error(`${name} must be a float`);
  };

  static decimalValue = ({ name, value }) => {
    this.fieldName({ name });
    if (typeof value !== "number") throw new Error(`${name} must be a decimal`);
  };


  static normalArrayValue ({ name, value }) {
    if (!Array.isArray(value)) {
      throw new Error(`${name} must be an array`);
    }
    if (value.length === 0) {
      throw new Error(`${name} cannot be an empty array`);
    }

    // Optionally, you can perform additional validations for the elements inside the array
    value.forEach((item, index) => {
      if (typeof item !== "object" || !item.color || !item.points) {
        throw new Error(
          `${name}[${index}] must be an object with 'color' and 'points' properties`
        );
      }

      if (typeof item.color !== "string") {
        throw new Error(`${name}[${index}].color must be a string`);
      }

      if (!Array.isArray(item.points) || item.points.length === 0) {
        throw new Error(`${name}[${index}].points must be a non-empty array`);
      }

      item.points.forEach((point, pointIndex) => {
        if (
          typeof point !== "object" ||
          typeof point.x !== "number" ||
          typeof point.y !== "number"
        ) {
          throw new Error(
            `${name}[${index}].points[${pointIndex}] must be an object with numeric 'x' and 'y' properties`
          );
        }
      });
    });
  };
  
  static arrayValue = ({ name, value }) => {
    console.log("Validating array:", name, value);
    
    if (!Array.isArray(value)) {
        throw new Error(`${name} must be an array`);
    }

    // Updated required fields to handle datetime
    const requiredFields = [
        { key: 'TreatmentName', type: 'string' },
        { key: 'StartDate', type: 'string' }, // Removed pattern since we'll handle date validation separately
        { key: 'EndDate', type: 'string' },   // Removed pattern since we'll handle date validation separately
        { key: 'TreatmentStatus', type: 'string' },
        // { key: 'CDTCode', type: 'string' },
        { key: 'Info', type: 'string' }
    ];

    // Prepare data for TVP with datetime columns
    const tvpData = new all.Table();
    tvpData.columns.add('TreatmentName', all.VarChar(255));  // Updated length to match SQL definition
    tvpData.columns.add('StartDate', all.DateTime);          // Changed to DateTime
    tvpData.columns.add('EndDate', all.DateTime);            // Changed to DateTime
    tvpData.columns.add('TreatmentStatus', all.VarChar(50));
    tvpData.columns.add('CDTCode', all.VarChar(10));
    tvpData.columns.add('Info', all.Text);

    // Helper function to validate and parse date
    const isValidDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    };

    value.forEach((item, index) => {
        console.log("Validating object at index:", index, item);
        
        if (typeof item !== 'object' || item === null) {
            throw new Error(`${name}[${index}] must be a non-null object`);
        }

        // Validate required fields
        requiredFields.forEach(({ key, type }) => {
            if (!item.hasOwnProperty(key)) {
                throw new Error(`${name}[${index}] missing required field: ${key}`);
            }
            if (typeof item[key] !== type) {
                throw new Error(`${name}[${index}].${key} must be a ${type}`);
            }
        });

        // Additional datetime validation
        if (!isValidDateTime(item.StartDate)) {
            throw new Error(`${name}[${index}].StartDate must be a valid datetime`);
        }
        if (!isValidDateTime(item.EndDate)) {
            throw new Error(`${name}[${index}].EndDate must be a valid datetime`);
        }

        // Add validated item to the TVP data
        tvpData.rows.add(
            item.TreatmentName,
            // new Date(item.StartDate), // Convert to Date object
            // new Date(item.EndDate),   // Convert to Date object
            item.StartDate,
            item.EndDate, 
            item.TreatmentStatus,
            item.CDTCode,
            item.Info
        );
        
        console.log(`Validation passed for ${name}[${index}]`);
    });

    console.log("Array validation completed successfully.");
    return tvpData;
};
}

export default Validation;
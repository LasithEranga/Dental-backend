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

  // static arrayValue = ({ name, value }) => {
  //   this.fieldName({ name });
  //   if (!Array.isArray(value)) throw new Error(`${name} must be a array`);
  //   console.log("value pass in arrayvalue function ", value);
  // };

  // static arrayValue = ({ name, value }) => {
  //     console.log("Validating array //////////:", name, value);
  //     this.fieldName({ name });
  //     if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  //     value.forEach((item, index) => {
  //       if (typeof item !== 'object') throw new Error(`${name}[${index}] must be an object`);
  //       console.log("Validating each objects:", name, index);
  //       // Validate each field of the treatment data object as needed
  //       if (!item.StartDate || typeof item.StartDate !== 'string') 
  //           throw new Error(`${name}[${index}].StartDate must be a string`);
  //       // Add additional field validations here
  //     });
  // };

  static arrayValue = ({ name, value }) => {
    console.log("Validating array //////////:", name, value);
    
    // Validate that value is an array
    this.fieldName({ name });
    if (!Array.isArray(value)) {
        throw new Error(`${name} must be an array`);
    }

    // Validate each item in the array
    value.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
            throw new Error(`${name}[${index}] must be a non-null object`);
        }

        console.log("Validating each object:", name, index);

        // Check required fields with specific type validation
        const requiredFields = [
            { key: 'StartDate', type: 'string' },
            { key: 'EndDate', type: 'string' },
            { key: 'TreatmentStatus', type: 'string' },
            { key: 'SelectedTeethPath', type: 'string' },
            { key: 'TeethUpSelectedPath', type: 'string' },
            { key: 'TeethSideSelectedPath', type: 'string' },
            { key: 'TeethImageFileName', type: 'string' },
            { key: 'DrawData', type: 'string' },
            { key: 'CDTCode', type: 'string' },
            { key: 'Info', type: 'string' }
        ];

        requiredFields.forEach(({ key, type }) => {
            if (!item.hasOwnProperty(key) || typeof item[key] !== type) {
                throw new Error(`${name}[${index}].${key} must be a ${type}`);
            }
        });

        // Additional field-specific validation
        if (!item.StartDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            throw new Error(`${name}[${index}].StartDate must be in YYYY-MM-DD format`);
        }
        if (!item.EndDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            throw new Error(`${name}[${index}].EndDate must be in YYYY-MM-DD format`);
        }

        // Add further specific validations as necessary
    });
};



}

export default Validation;

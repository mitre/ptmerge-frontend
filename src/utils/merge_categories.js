import PropertyMerge from '../components/Merge/PropertyMerge';
import SimpleMerge from '../components/Merge/SimpleMerge';

export const mergeCategories = [
  {
    "id": "allergy",
    "name": "Allergy",
    "klass": null
  },
  {
    "id": "behavior",
    "name": "Behavior",
    "klass": null
  },
  {
    "id": "condition",
    "name": "Condition",
    "klass": null
  },
  {
    "id": "demographics",
    "name": "Demographics",
    "klass": null,
    "subcategories": [
      {
        "id": "demographics.address",
        "name": "Address",
        "klass": PropertyMerge
      },
      {
        "id": "demographics.age",
        "name": "Age",
        "klass": SimpleMerge
      },
      {
        "id": "demographics.dateOfBirth",
        "name": "Date of Birth",
        "klass": SimpleMerge
      },
      {
        "id": "demographics.gender",
        "name": "Gender",
        "klass": SimpleMerge
      },
      {
        "id": "demographics.healthInsurance",
        "name": "Health Insurance",
        "klass": null
      },
      {
        "id": "demographics.humanName",
        "name": "Human Name",
        "klass": PropertyMerge
      },
      {
        "id": "demographics.maritalStatus",
        "name": "Marital Status",
        "klass": SimpleMerge
      },
      {
        "id": "demographics.phone",
        "name": "Phone",
        "klass": SimpleMerge
      },      
      {
        "id": "demographics.placeOfBirth",
        "name": "Place of Birth",
        "klass": null
      },
      {
        "id": "demographics.socialSecurityNumber",
        "name": "Social Security Number",
        "klass": null
      }
    ]
  },
  {
    "id": "encounter",
    "name": "Encounter",
    "klass": null
  },
  {
    "id": "familyHistory",
    "name": "Family History",
    "klass": null
  },
  {
    "id": "immunization",
    "name": "Immunization",
    "klass": null
  },
  {
    "id": "lab",
    "name": "Lab",
    "klass": null
  },
  {
    "id": "lifeHistory",
    "name": "Life History",
    "klass": null
  },
  {
    "id": "medication",
    "name": "Medication",
    "klass": null
  },
  {
    "id": "vital",
    "name": "Vital",
    "klass": null
  }
];

export default mergeCategories;

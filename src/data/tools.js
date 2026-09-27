// The starting tools have fixed ids so you can test them by id, even after a
// restart. Tools created through the API get an id from crypto.randomUUID().
export const tools = [
  {
    id: 'cdcec443-777e-4c9a-b558-7e699f60ff7c',
    name: 'Cordless drill',
    category: 'power',
    condition: 'good',
    available: true,
    maxLoanDays: 7,
  },
  {
    id: 'e51f7492-9f4f-4eb0-ba04-ee8e9308d41c',
    name: 'Circular saw',
    category: 'power',
    condition: 'worn',
    available: false,
    maxLoanDays: 3,
  },
  {
    id: '0405a72e-1e1e-4c19-ba7c-e5f02af2bdc1',
    name: 'Hedge trimmer',
    category: 'garden',
    condition: 'good',
    available: true,
    maxLoanDays: 5,
  },
  {
    id: 'a6226d78-cad9-4b73-9203-9f8dd1a4e990',
    name: 'Socket wrench set',
    category: 'hand',
    condition: 'new',
    available: true,
    maxLoanDays: 14,
  },
  {
    id: 'd3066977-494f-495f-9bdc-9ed25138fc82',
    name: 'Carpet cleaner',
    category: 'cleaning',
    condition: 'good',
    available: false,
    maxLoanDays: 2,
  },
  {
    id: '7332b631-aa8c-40e7-a5e0-0886eff82b1a',
    name: 'Wheelbarrow',
    category: 'garden',
    condition: 'worn',
    available: true,
    maxLoanDays: 7,
  },
];

export const CATEGORIES = ['power', 'hand', 'garden', 'cleaning'];
export const CONDITIONS = ['new', 'good', 'worn'];

import { z } from 'zod'

const required = (msg) => z.string().trim().min(1, msg)
const pct = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 100, 'Enter a value between 0 and 100')

export const CDD_STATUSES = ['Pending', 'In review', 'Approved', 'Rejected']
export const COMPANY_STATUSES = ['Active', 'Dormant', 'Struck off', 'In liquidation']
export const COMPANY_TYPES = ['Private limited', 'Public limited', 'LLP', 'Partnership', 'Branch office']

export const schema = z.object({
  // CDD Metadata
  customer: required('Customer is required'),
  cddDate: required('CDD date is required'),
  cddStatus: z.enum(CDD_STATUSES, 'Select a CDD status'),

  // Business Profile
  name: required('Company name is required'),
  jurisdiction: required('Jurisdiction is required'),
  status: z.enum(COMPANY_STATUSES, 'Select a status'),
  registrationNo: required('Registration number is required'),
  companyType: z.enum(COMPANY_TYPES, 'Select a company type'),
  paidUpCapital: z
    .string()
    .trim()
    .min(1, 'Paid up capital is required')
    .refine((v) => !Number.isNaN(Number(v.replace(/,/g, ''))) && Number(v.replace(/,/g, '')) >= 0, 'Enter a valid amount'),
  activity: required('Activity is required'),
  incorporationDate: required('Incorporation date is required'),
  address: required('Address is required'),

  // Ownership & Control
  ubos: z
    .array(
      z.object({
        name: required('Name is required'),
        nationality: required('Nationality is required'),
        percent: pct('Ownership %'),
      })
    )
    .min(1, 'Add at least one UBO'),
  shareholders: z
    .array(
      z.object({
        name: required('Name is required'),
        percent: pct('Shareholding %').refine((v) => Number(v) > 10, 'Must be above 10%'),
      })
    )
    .min(1, 'Add at least one shareholder above 10%'),
  relatedParties: z.array(
    z.object({
      name: required('Name is required'),
      relationship: required('Relationship is required'),
    })
  ),
})

export const SECTIONS = [
  {
    id: 'cdd',
    title: 'CDD Metadata',
    fields: ['customer', 'cddDate', 'cddStatus'],
  },
  {
    id: 'business',
    title: 'Business Profile',
    fields: [
      'name',
      'jurisdiction',
      'status',
      'registrationNo',
      'companyType',
      'paidUpCapital',
      'activity',
      'incorporationDate',
      'address',
    ],
  },
  {
    id: 'ownership',
    title: 'Ownership & Control',
    fields: ['ubos', 'shareholders', 'relatedParties'],
  },
]

export const emptyValues = {
  customer: '',
  cddDate: '',
  cddStatus: '',
  name: '',
  jurisdiction: '',
  status: '',
  registrationNo: '',
  companyType: '',
  paidUpCapital: '',
  activity: '',
  incorporationDate: '',
  address: '',
  ubos: [{ name: '', nationality: '', percent: '' }],
  shareholders: [{ name: '', percent: '' }],
  relatedParties: [],
}

// Simulated data used by the chatbot's "fill" action, applied section by section.
export const demoData = {
  cdd: {
    customer: 'Meridian Holdings Pte Ltd',
    cddDate: new Date().toISOString().slice(0, 10),
    cddStatus: 'In review',
  },
  business: {
    name: 'Meridian Holdings Pte Ltd',
    jurisdiction: 'Singapore',
    status: 'Active',
    registrationNo: '201912345K',
    companyType: 'Private limited',
    paidUpCapital: '2,500,000',
    activity: 'Investment holding and commodity trading',
    incorporationDate: '2019-04-12',
    address: '8 Marina Boulevard, #05-02, Singapore 018981',
  },
  ownership: {
    ubos: [
      { name: 'Elena Marchetti', nationality: 'Italian', percent: '45' },
      { name: 'Tan Wei Ming', nationality: 'Singaporean', percent: '30' },
    ],
    shareholders: [
      { name: 'Elena Marchetti', percent: '45' },
      { name: 'Tan Wei Ming', percent: '30' },
      { name: 'Harbourline Capital Ltd', percent: '25' },
    ],
    relatedParties: [
      { name: 'Meridian Logistics Sdn Bhd', relationship: 'Subsidiary' },
      { name: 'Harbourline Capital Ltd', relationship: 'Corporate shareholder' },
    ],
  },
}

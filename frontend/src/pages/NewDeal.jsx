import React, { useState } from 'react'
import { api } from '../api'
import { ArrowLeft, Save, Building2, DollarSign, TrendingUp, Percent } from 'lucide-react'

function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-cw-card border border-cw-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <h3 className="text-sm font-semibold text-gray-400">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, suffix, required, half }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs text-gray-500 mb-1">
        {label} {required && <span className="text-cw-red">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange(type === 'number' ? (e.target.value ? Number(e.target.value) : null) : e.target.value)}
          placeholder={placeholder}
          className="w-full bg-cw-dark border border-cw-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-cw-accent focus:outline-none"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{suffix}</span>}
      </div>
    </div>
  )
}

export default function NewDeal({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    name: '', address: '', city: '', state: '', submarket: '',
    units: null, total_sf: null, year_built: null,
    property_type: 'garden', deal_type: 'acquisition',
    purchase_price: null, closing_costs: null, capex_budget: null,
    gross_potential_rent: null, vacancy_rate: 0.05, other_income_per_unit: 0,
    taxes: null, insurance: null, utilities: null, repairs_maintenance: null,
    management_fee_pct: 0.03, admin: null, payroll: null, capex_reserve_per_unit: 250,
    ltv: 0.65, interest_rate: 0.065, amortization_years: 30, io_period_months: 0, loan_term_years: 10,
    exit_cap_rate: 0.055, sale_costs_pct: 0.02, hold_period_years: 5,
    broker_name: '', broker_company: '', broker_email: '', broker_phone: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) { setError('Deal name is required'); return }
    setSaving(true); setError(null)
    try {
      const result = await api.createDeal(form)
      onCreated(result.id)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-cw-hover">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold flex-1">New Deal</h1>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-cw-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Create Deal'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-cw-red text-sm p-3 rounded-lg">{error}</div>
      )}

      <FormSection title="Property Information" icon={Building2}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Deal Name" value={form.name} onChange={update('name')} placeholder="e.g. Cypress Creek Apartments" required />
          <Field label="Address" value={form.address} onChange={update('address')} placeholder="123 Main St" />
          <Field label="City" value={form.city} onChange={update('city')} half />
          <Field label="State" value={form.state} onChange={update('state')} placeholder="NC" half />
          <Field label="Submarket" value={form.submarket} onChange={update('submarket')} half />
          <Field label="Units" type="number" value={form.units} onChange={update('units')} half />
          <Field label="Total SF" type="number" value={form.total_sf} onChange={update('total_sf')} half />
          <Field label="Year Built" type="number" value={form.year_built} onChange={update('year_built')} half />
          <div className="col-span-1">
            <label className="block text-xs text-gray-500 mb-1">Property Type</label>
            <select value={form.property_type} onChange={e => update('property_type')(e.target.value)} className="w-full bg-cw-dark border border-cw-border rounded-lg px-3 py-2 text-sm text-white">
              <option value="garden">Garden</option>
              <option value="mid-rise">Mid-Rise</option>
              <option value="high-rise">High-Rise</option>
              <option value="townhome">Townhome</option>
              <option value="mixed-use">Mixed-Use</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs text-gray-500 mb-1">Deal Type</label>
            <select value={form.deal_type} onChange={e => update('deal_type')(e.target.value)} className="w-full bg-cw-dark border border-cw-border rounded-lg px-3 py-2 text-sm text-white">
              <option value="acquisition">Acquisition</option>
              <option value="development">Development</option>
              <option value="value-add">Value-Add</option>
              <option value="stabilized">Stabilized</option>
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Acquisition" icon={DollarSign}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Purchase Price" type="number" value={form.purchase_price} onChange={update('purchase_price')} placeholder="25000000" half />
          <Field label="Closing Costs" type="number" value={form.closing_costs} onChange={update('closing_costs')} half />
          <Field label="Capex Budget" type="number" value={form.capex_budget} onChange={update('capex_budget')} half />
        </div>
      </FormSection>

      <FormSection title="Revenue (Annual)" icon={TrendingUp}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gross Potential Rent (Annual)" type="number" value={form.gross_potential_rent} onChange={update('gross_potential_rent')} half />
          <Field label="Vacancy Rate" type="number" value={form.vacancy_rate} onChange={update('vacancy_rate')} placeholder="0.05" half />
          <Field label="Other Income / Unit (Annual)" type="number" value={form.other_income_per_unit} onChange={update('other_income_per_unit')} half />
        </div>
      </FormSection>

      <FormSection title="Expenses (Annual)" icon={DollarSign}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Real Estate Taxes" type="number" value={form.taxes} onChange={update('taxes')} half />
          <Field label="Insurance" type="number" value={form.insurance} onChange={update('insurance')} half />
          <Field label="Utilities" type="number" value={form.utilities} onChange={update('utilities')} half />
          <Field label="Repairs & Maintenance" type="number" value={form.repairs_maintenance} onChange={update('repairs_maintenance')} half />
          <Field label="Management Fee %" type="number" value={form.management_fee_pct} onChange={update('management_fee_pct')} placeholder="0.03" half />
          <Field label="Admin / G&A" type="number" value={form.admin} onChange={update('admin')} half />
          <Field label="Payroll" type="number" value={form.payroll} onChange={update('payroll')} half />
          <Field label="Capex Reserve / Unit" type="number" value={form.capex_reserve_per_unit} onChange={update('capex_reserve_per_unit')} half />
        </div>
      </FormSection>

      <FormSection title="Financing" icon={Percent}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="LTV" type="number" value={form.ltv} onChange={update('ltv')} placeholder="0.65" half />
          <Field label="Interest Rate" type="number" value={form.interest_rate} onChange={update('interest_rate')} placeholder="0.065" half />
          <Field label="Amortization (years)" type="number" value={form.amortization_years} onChange={update('amortization_years')} half />
          <Field label="IO Period (months)" type="number" value={form.io_period_months} onChange={update('io_period_months')} half />
          <Field label="Loan Term (years)" type="number" value={form.loan_term_years} onChange={update('loan_term_years')} half />
        </div>
      </FormSection>

      <FormSection title="Exit Assumptions" icon={TrendingUp}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Exit Cap Rate" type="number" value={form.exit_cap_rate} onChange={update('exit_cap_rate')} placeholder="0.055" half />
          <Field label="Sale Costs %" type="number" value={form.sale_costs_pct} onChange={update('sale_costs_pct')} placeholder="0.02" half />
          <Field label="Hold Period (years)" type="number" value={form.hold_period_years} onChange={update('hold_period_years')} half />
        </div>
      </FormSection>

      <FormSection title="Broker" icon={Building2}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Broker Name" value={form.broker_name} onChange={update('broker_name')} half />
          <Field label="Company" value={form.broker_company} onChange={update('broker_company')} half />
          <Field label="Email" value={form.broker_email} onChange={update('broker_email')} half />
          <Field label="Phone" value={form.broker_phone} onChange={update('broker_phone')} half />
        </div>
      </FormSection>

      <FormSection title="Notes">
        <textarea
          value={form.notes}
          onChange={e => update('notes')(e.target.value)}
          className="w-full bg-cw-dark border border-cw-border rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:border-cw-accent focus:outline-none min-h-[100px] resize-y"
          placeholder="Initial notes, investment thesis, key considerations..."
        />
      </FormSection>

      <div className="flex justify-end gap-3 pb-8">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-400 text-sm rounded-lg hover:bg-cw-hover">Cancel</button>
        <button type="submit" disabled={saving} className="px-6 py-2 bg-cw-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Deal'}
        </button>
      </div>
    </form>
  )
}

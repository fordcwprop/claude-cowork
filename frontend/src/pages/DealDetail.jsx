import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { ArrowLeft, Star, Save, AlertTriangle, CheckCircle, XCircle, TrendingUp, Building2, DollarSign, Calendar, Edit3 } from 'lucide-react'

const STATUSES = ['sourced', 'under_review', 'modeled', 'shortlisted', 'under_contract', 'closed', 'dead']

function MetricCard({ label, value, sub, good, warn }) {
  let color = 'text-white'
  if (good !== undefined) {
    color = good ? 'text-cw-green' : warn ? 'text-cw-yellow' : 'text-cw-red'
  }
  return (
    <div className="bg-cw-dark rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function RiskBadge({ risk }) {
  if (!risk) return null
  const colors = { low: 'bg-green-900/50 text-cw-green border-green-800', medium: 'bg-yellow-900/50 text-cw-yellow border-yellow-800', high: 'bg-red-900/50 text-cw-red border-red-800' }
  return (
    <div className={`rounded-lg border p-3 ${colors[risk.level] || ''}`}>
      <div className="flex items-center gap-2 mb-2">
        {risk.level === 'low' ? <CheckCircle className="w-4 h-4" /> : risk.level === 'high' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        <span className="text-sm font-semibold">Risk Score: {risk.score}/10 ({risk.level})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {risk.factors.map((f, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded ${f.type === 'positive' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {f.text}
          </span>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children, icon: Icon }) {
  return (
    <div className="bg-cw-card border border-cw-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <h3 className="text-sm font-semibold text-gray-400">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function DealDetail({ dealId, onBack }) {
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editNotes, setEditNotes] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!dealId) return
    setLoading(true)
    api.getDeal(dealId)
      .then(d => { setDeal(d); setNotes(d.notes || '') })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [dealId])

  const updateField = async (field, value) => {
    setSaving(true)
    try {
      const updated = await api.updateDeal(dealId, { [field]: value })
      setDeal(updated)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const saveNotes = async () => {
    await updateField('notes', notes)
    setEditNotes(false)
  }

  if (loading || !deal) {
    return <div className="p-8 flex items-center justify-center h-full"><div className="text-gray-500">Loading deal...</div></div>
  }

  const m = deal.metrics || {}
  const fmt = (v, suffix = '') => v ? `${v}${suffix}` : '—'
  const fmtPct = (v) => v ? `${(v * 100).toFixed(2)}%` : '—'
  const fmtMoney = (v) => v ? `$${v.toLocaleString()}` : '—'
  const fmtMoneyM = (v) => v ? `$${(v / 1e6).toFixed(2)}M` : '—'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-cw-hover transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{deal.name}</h1>
            <button onClick={() => updateField('starred', deal.starred ? 0 : 1)} className="p-1">
              <Star className={`w-5 h-5 ${deal.starred ? 'text-cw-yellow fill-cw-yellow' : 'text-gray-600'}`} />
            </button>
            {saving && <span className="text-xs text-gray-500">Saving...</span>}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            {[deal.address, deal.city, deal.state].filter(Boolean).join(', ')}
            {deal.submarket ? ` · ${deal.submarket}` : ''}
          </div>
        </div>
        <select
          value={deal.status}
          onChange={e => updateField('status', e.target.value)}
          className="bg-cw-dark border border-cw-border rounded-lg px-3 py-2 text-sm"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Risk Assessment */}
      <RiskBadge risk={deal.risk} />

      {/* Key Metrics */}
      <Section title="Key Metrics" icon={TrendingUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <MetricCard label="Going-in Cap" value={fmtPct(m.going_in_cap_rate)} good={m.going_in_cap_rate >= 0.055} warn={m.going_in_cap_rate >= 0.045} />
          <MetricCard label="DSCR" value={m.dscr ? `${m.dscr.toFixed(2)}x` : '—'} good={m.dscr >= 1.25} warn={m.dscr >= 1.15} />
          <MetricCard label="Cash-on-Cash" value={fmtPct(m.cash_on_cash)} good={m.cash_on_cash >= 0.06} warn={m.cash_on_cash >= 0.04} />
          <MetricCard label="Levered IRR" value={fmtPct(m.levered_irr)} good={m.levered_irr >= 0.13} warn={m.levered_irr >= 0.10} />
          <MetricCard label="Equity Multiple" value={m.equity_multiple ? `${m.equity_multiple.toFixed(2)}x` : '—'} good={m.equity_multiple >= 1.8} warn={m.equity_multiple >= 1.5} />
          <MetricCard label="NOI" value={fmtMoney(m.noi)} />
          <MetricCard label="Price / Unit" value={fmtMoney(m.price_per_unit)} />
          <MetricCard label="Price / SF" value={fmtMoney(m.price_per_sf)} />
          <MetricCard label="Yield on Cost" value={fmtPct(m.yield_on_cost)} />
          <MetricCard label="Expense Ratio" value={fmtPct(m.expense_ratio)} />
        </div>
      </Section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Info */}
        <Section title="Property" icon={Building2}>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Units</div><div>{deal.units || '—'}</div>
            <div className="text-gray-500">Total SF</div><div>{deal.total_sf ? deal.total_sf.toLocaleString() : '—'}</div>
            <div className="text-gray-500">Year Built</div><div>{deal.year_built || '—'}</div>
            <div className="text-gray-500">Type</div><div className="capitalize">{deal.property_type || '—'}</div>
            <div className="text-gray-500">Deal Type</div><div className="capitalize">{deal.deal_type || '—'}</div>
          </div>
        </Section>

        {/* Acquisition & Financing */}
        <Section title="Acquisition & Financing" icon={DollarSign}>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Purchase Price</div><div>{fmtMoney(deal.purchase_price)}</div>
            <div className="text-gray-500">Closing Costs</div><div>{fmtMoney(deal.closing_costs)}</div>
            <div className="text-gray-500">Capex Budget</div><div>{fmtMoney(deal.capex_budget)}</div>
            <div className="text-gray-500">Total Basis</div><div className="font-medium">{fmtMoney(m.total_basis)}</div>
            <div className="text-gray-500">Loan ({deal.ltv ? `${(deal.ltv * 100).toFixed(0)}%` : '—'} LTV)</div><div>{fmtMoney(m.loan_amount)}</div>
            <div className="text-gray-500">Equity Required</div><div className="font-medium text-cw-accent">{fmtMoney(m.equity)}</div>
            <div className="text-gray-500">Interest Rate</div><div>{deal.interest_rate ? `${(deal.interest_rate * 100).toFixed(2)}%` : '—'}</div>
            <div className="text-gray-500">Amortization</div><div>{deal.amortization_years ? `${deal.amortization_years} years` : '—'}</div>
            <div className="text-gray-500">IO Period</div><div>{deal.io_period_months ? `${deal.io_period_months} months` : 'None'}</div>
            <div className="text-gray-500">Annual Debt Service</div><div>{fmtMoney(m.annual_debt_service)}</div>
          </div>
        </Section>

        {/* Key Dates */}
        <Section title="Timeline" icon={Calendar}>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {[
              ['Listed', deal.date_listed],
              ['CFO', deal.date_cfo],
              ['Best & Final', deal.date_best_final],
              ['LOI Submitted', deal.date_loi_submitted],
              ['LOI Accepted', deal.date_loi_accepted],
              ['DD Start', deal.date_dd_start],
              ['DD End', deal.date_dd_end],
              ['Closing', deal.date_closing],
            ].map(([label, val]) => (
              <React.Fragment key={label}>
                <div className="text-gray-500">{label}</div>
                <div>{val || '—'}</div>
              </React.Fragment>
            ))}
          </div>
        </Section>

        {/* Broker */}
        <Section title="Broker Info" icon={Building2}>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Name</div><div>{deal.broker_name || '—'}</div>
            <div className="text-gray-500">Company</div><div>{deal.broker_company || '—'}</div>
            <div className="text-gray-500">Email</div><div>{deal.broker_email || '—'}</div>
            <div className="text-gray-500">Phone</div><div>{deal.broker_phone || '—'}</div>
          </div>
        </Section>
      </div>

      {/* Notes */}
      <Section title="Notes" icon={Edit3}>
        {editNotes ? (
          <div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-cw-dark border border-cw-border rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:border-cw-accent focus:outline-none min-h-[120px] resize-y"
              placeholder="Add deal notes..."
            />
            <div className="flex gap-2 mt-2">
              <button onClick={saveNotes} className="px-3 py-1.5 bg-cw-accent text-white text-sm rounded-lg hover:bg-blue-600">
                <Save className="w-3 h-3 inline mr-1" /> Save
              </button>
              <button onClick={() => { setNotes(deal.notes || ''); setEditNotes(false) }} className="px-3 py-1.5 text-gray-400 text-sm rounded-lg hover:bg-cw-hover">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div onClick={() => setEditNotes(true)} className="cursor-pointer hover:bg-cw-dark rounded-lg p-2 -m-2 transition-colors">
            {deal.notes ? (
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{deal.notes}</p>
            ) : (
              <p className="text-sm text-gray-600 italic">Click to add notes...</p>
            )}
          </div>
        )}
      </Section>

      {/* Investment Thesis & Risk Factors */}
      {(deal.investment_thesis || deal.risk_factors || deal.summary) && (
        <div className="grid md:grid-cols-2 gap-6">
          {deal.investment_thesis && (
            <Section title="Investment Thesis">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{deal.investment_thesis}</p>
            </Section>
          )}
          {deal.risk_factors && (
            <Section title="Risk Factors">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{deal.risk_factors}</p>
            </Section>
          )}
        </div>
      )}

      {/* Activity */}
      {deal.activity && deal.activity.length > 0 && (
        <Section title="Activity">
          <div className="space-y-2">
            {deal.activity.map(a => (
              <div key={a.id} className="flex items-center gap-3 text-xs py-1">
                <span className="text-gray-600 w-32 shrink-0">{new Date(a.created_at).toLocaleString()}</span>
                <span className="text-gray-300">{a.action.replace(/_/g, ' ')}</span>
                <span className="text-gray-500">{a.user_email}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

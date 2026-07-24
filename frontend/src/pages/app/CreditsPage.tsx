import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Coins, TrendingUp, TrendingDown, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { weeklyCreditsData } from '../../data/mockData';

const RANK_COLORS: Record<string, string> = {
  'Bronze': 'text-orange-600',
  'Silver': 'text-slate-500',
  'Gold Creator': 'text-yellow-500',
  'Platinum': 'text-cyan-500',
};

export default function CreditsPage() {
  const { creditBalance, totalEarned, totalSpent, transactions, user } = useStore();

  const summaryCards = [
    { label: 'Total Balance', value: creditBalance, icon: Coins, color: 'bg-[#C6FF3D]/20', iconColor: 'text-[#0A0A0A]', textColor: 'text-[#0A0A0A]' },
    { label: 'Total Earned', value: totalEarned, icon: TrendingUp, color: 'bg-[#22C55E]/10', iconColor: 'text-[#22C55E]', textColor: 'text-[#22C55E]' },
    { label: 'Total Spent', value: totalSpent, icon: TrendingDown, color: 'bg-red-50', iconColor: 'text-red-500', textColor: 'text-red-500' },
    { label: 'Current Rank', value: user.rank, icon: Award, color: 'bg-[#3D5CFF]/10', iconColor: 'text-[#3D5CFF]', textColor: RANK_COLORS[user.rank] || 'text-[#3D5CFF]', isString: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[#0A0A0A]">Credits</h1>
        <p className="text-xs text-[#6B6B6B] mt-1">Track your earnings, spending, and rank progress</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, color, iconColor, textColor, isString }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${color} rounded-card p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-2xs font-medium text-[#6B6B6B]">{label}</p>
              <div className="p-2 rounded-btn bg-white/60">
                <Icon size={16} className={iconColor} />
              </div>
            </div>
            <p className={`text-xl font-display font-bold ${textColor}`}>
              {isString ? value : `${value}`}
              {!isString && <span className="text-xs font-normal text-[#6B6B6B] ml-1">credits</span>}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-white rounded-card border border-[#EAEAEA] p-6"
        >
          <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-1">Weekly Activity</h2>
          <p className="text-2xs text-[#6B6B6B] mb-5">Credits earned and spent this week</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyCreditsData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #EAEAEA', fontSize: 12 }}
                cursor={{ fill: '#FAFAFA' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="earned" name="Earned" fill="#C6FF3D" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Spent" fill="#3D5CFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-card border border-[#EAEAEA] p-6"
        >
          <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-1">Recent Activity</h2>
          <p className="text-2xs text-[#6B6B6B] mb-5">Your latest transactions</p>
          <div className="space-y-3 overflow-y-auto max-h-[260px]">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.04 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'earned' ? 'bg-[#22C55E]/10' : 'bg-red-50'}`}>
                  {tx.type === 'earned'
                    ? <ArrowUpRight size={14} className="text-[#22C55E]" />
                    : <ArrowDownRight size={14} className="text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#0A0A0A] leading-snug truncate">{tx.description}</p>
                  <p className="text-2xs text-[#6B6B6B] mt-0.5">{tx.reference}</p>
                </div>
                <span className={`text-xs font-semibold shrink-0 ${tx.type === 'earned' ? 'text-[#22C55E]' : 'text-red-500'}`}>
                  {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import {
  Fish, ShoppingCart, Briefcase, TrendingUp, Gift, UserX, Copy, Heart, CreditCard, Brain,
  X, AlertTriangle, ShieldCheck, BookOpen, ArrowLeft,
} from 'lucide-react';
import { LEARNING_TOPICS } from '@/data';
import type { LearningTopic } from '@/types';

const ICON_MAP: Record<string, typeof Fish> = {
  Fish, ShoppingCart, Briefcase, TrendingUp, Gift, UserX, Copy, Heart, CreditCard, Brain,
};

export default function LearningCenterPage() {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);

  if (selectedTopic) {
    const Icon = ICON_MAP[selectedTopic.icon] || BookOpen;
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm text-navy-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Center
        </button>

        <Card className="p-6 lg:p-8">
          <div className={`w-14 h-14 rounded-2xl bg-${selectedTopic.color}-500/15 border border-${selectedTopic.color}-500/30 flex items-center justify-center mb-5`}>
            <Icon className={`w-7 h-7 text-${selectedTopic.color}-400`} />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">{selectedTopic.title}</h1>
          <p className="text-navy-300 mt-2">{selectedTopic.shortDescription}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-white mb-3">What is it?</h2>
          <p className="text-sm text-navy-200 leading-relaxed">{selectedTopic.whatIsIt}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-white mb-3">How it works</h2>
          <p className="text-sm text-navy-200 leading-relaxed">{selectedTopic.howItWorks}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning-400" />
            <h2 className="text-lg font-bold text-white">Common warning signs</h2>
          </div>
          <div className="grid gap-2.5">
            {selectedTopic.warningSigns.map((sign, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-warning-500/8 border border-warning-500/20 px-4 py-2.5">
                <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-navy-100">{sign}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-success-400" />
            <h2 className="text-lg font-bold text-white">How to protect yourself</h2>
          </div>
          <div className="grid gap-2.5">
            {selectedTopic.protection.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-success-500/8 border border-success-500/20 px-4 py-2.5">
                <ShieldCheck className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-navy-100">{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">What to do if you already interacted</h2>
          </div>
          <p className="text-sm text-navy-200 leading-relaxed">{selectedTopic.afterInteraction}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Learning Center</h1>
        </div>
        <p className="text-navy-300">Explore common scam types and learn how to protect yourself.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEARNING_TOPICS.map((topic, i) => {
          const Icon = ICON_MAP[topic.icon] || BookOpen;
          return (
            <Card key={topic.id} hover className="p-5 group cursor-pointer animate-fade-in-up" onClick={() => setSelectedTopic(topic)} style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
              <div className={`w-12 h-12 rounded-xl bg-${topic.color}-500/15 border border-${topic.color}-500/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <Icon className={`w-6 h-6 text-${topic.color}-400`} />
              </div>
              <h3 className="text-base font-bold text-white">{topic.title}</h3>
              <p className="text-sm text-navy-300 mt-1.5 leading-relaxed">{topic.shortDescription}</p>
              <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-300 group-hover:gap-2.5 transition-all">
                Learn More <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

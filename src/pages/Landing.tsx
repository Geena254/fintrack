import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, ArrowRight, BarChart3, Shield, Wallet, Target, PiggyBank, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Wallet,
    title: "Track Transactions",
    description: "Log every income and expense with categories, dates, and descriptions.",
  },
  {
    icon: BarChart3,
    title: "Budget Planning",
    description: "Set monthly budgets and watch spending auto-calculate from your transactions.",
  },
  {
    icon: Target,
    title: "Savings Goals",
    description: "Define financial goals with deadlines and track your progress visually.",
  },
  {
    icon: PiggyBank,
    title: "Net Savings",
    description: "See your total balance, monthly income, expenses, and net savings at a glance.",
  },
  {
    icon: Zap,
    title: "CSV Export",
    description: "Download your transaction history as a CSV file for external analysis.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and accessible only to you.",
  },
];

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yBadge = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const yHeading = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yButtons = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center overflow-hidden">
      <div className="space-y-6">
        <motion.div
          style={{ y: yBadge, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium"
        >
          <Zap className="w-3.5 h-3.5" />
          Simple. Powerful. Free.
        </motion.div>
        <motion.h1
          style={{ y: yHeading, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight"
        >
          Take Control of Your
          <span className="text-primary block">Personal Finances</span>
        </motion.h1>
        <motion.p
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Track spending, plan budgets, and achieve savings goals — all in one
          beautifully simple dashboard built for everyday Kenyans.
        </motion.p>
        <motion.div
          style={{ y: yButtons, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link to="/auth?mode=signup">
            <Button size="lg" className="gap-2 text-base px-8">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="text-base px-8">
              Sign In
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">FinTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="gap-1.5">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with parallax */}
      <HeroSection />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Everything you need to manage money</h2>
          <p className="text-muted-foreground mt-2">No spreadsheets. No complicated tools. Just clarity.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card rounded-xl p-6 hover:glow-primary transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-10 sm:p-14 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-3">
            Ready to get your finances on track?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Join FinTrack today and start managing your money with confidence.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="gap-2 text-base px-8">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">FinTrack</span>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} FinTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

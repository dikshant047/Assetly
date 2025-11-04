import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Lock,
  Zap,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InvestTrack</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Professional Investment Management Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Track Your Investments
              <br />
              With Confidence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage multiple portfolios, track investor deposits and withdrawals,
              and monitor real-time performance with institutional-grade analytics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  Start Tracking <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Portfolio Value", value: "$1M+", icon: DollarSign },
              { label: "Active Investors", value: "100+", icon: Users },
              { label: "Transactions", value: "1000+", icon: Activity },
              { label: "Uptime", value: "99.9%", icon: Zap },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6 space-y-2">
                  <stat.icon className="h-8 w-8 text-primary mx-auto" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for professional investment management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Track portfolio performance with advanced charting, metrics, and comprehensive insights into your investments."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Bank-level security with encryption to protect your sensitive financial data and investor information."
              },
              {
                icon: TrendingUp,
                title: "Performance Insights",
                description: "Detailed breakdowns of gains, losses, portfolio allocation, and individual investor performance."
              },
              {
                icon: Users,
                title: "Multi-Investor Support",
                description: "Manage multiple investors with individual accounts, track deposits, withdrawals, and profit distribution."
              },
              {
                icon: DollarSign,
                title: "Transaction Tracking",
                description: "Complete history of all deposits and withdrawals with automatic profit calculations and updates."
              },
              {
                icon: Activity,
                title: "Portfolio Management",
                description: "Update portfolio values, manage multiple investment strategies, and track performance over time."
              }
            ].map((feature, i) => (
              <Card key={i} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes with our simple process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up as an admin to manage your investment portfolio and add investors to the platform."
              },
              {
                step: "2",
                title: "Add Investors",
                description: "Create investor accounts, set initial deposits, and assign them to your portfolio for tracking."
              },
              {
                step: "3",
                title: "Track Performance",
                description: "Update portfolio values, record transactions, and watch as profits are automatically calculated."
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-12 space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Why Choose InvestTrack?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Built for professional investment managers
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8">
                {[
                  "Automatic profit calculations for each investor",
                  "Real-time portfolio value updates",
                  "Complete transaction history",
                  "Individual investor dashboards",
                  "Secure authentication and authorization",
                  "Responsive design for mobile and desktop",
                  "Easy deposit and withdrawal tracking",
                  "Professional reporting and analytics"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                  Join professional investors who trust InvestTrack to manage their portfolios
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                    Start Free Trial <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">InvestTrack</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 InvestTrack. All rights reserved. Professional Investment Management Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from 'react';

export default function SOPShowcase() {
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const features = [
    {
      category: "Workflow Management",
      icon: "📋",
      items: [
        "Visual workflow builder with drag-and-drop",
        "AI-powered workflow optimization",
        "Step-by-step process documentation",
        "Version control & change tracking",
        "Template library with 50+ pre-built SOPs",
        "Workflow duplication & cloning"
      ]
    },
    {
      category: "AI Intelligence",
      icon: "🤖",
      items: [
        "AI gap detection in processes",
        "Duplicate step identification",
        "Domain-agnostic analysis",
        "Smart recommendations & suggestions",
        "AI chat assistant for workflow help",
        "Automated efficiency scoring"
      ]
    },
    {
      category: "Analytics & Insights",
      icon: "📊",
      items: [
        "Real-time performance dashboards",
        "Process efficiency metrics",
        "Step completion tracking",
        "Team productivity analysis",
        "Bottleneck identification",
        "Trend analysis & forecasting"
      ]
    },
    {
      category: "Collaboration",
      icon: "👥",
      items: [
        "Multi-user workspace with role-based access",
        "Real-time collaboration",
        "Comments & annotations",
        "Assignment & delegation",
        "Team activity feeds",
        "Approval workflows"
      ]
    },
    {
      category: "Export & Integration",
      icon: "🔗",
      items: [
        "PDF export with branding",
        "Word document generation",
        "JSON/CSV data export",
        "API access for integrations",
        "Webhook notifications",
        "Third-party app connectivity"
      ]
    },
    {
      category: "Security & Compliance",
      icon: "🔒",
      items: [
        "Enterprise-grade encryption",
        "SOC 2 Type II compliant",
        "Role-based permissions (Admin/User)",
        "Audit logs & activity tracking",
        "GDPR & HIPAA ready",
        "SSO integration available"
      ]
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for individuals & small teams",
      features: [
        "5 workflows per month",
        "Basic AI analysis (50 tokens/month)",
        "Up to 3 team members",
        "PDF export",
        "Community support",
        "Core workflow features"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Best for growing teams",
      features: [
        "Unlimited workflows",
        "Advanced AI analysis (10,000 tokens/month)",
        "Up to 15 team members",
        "All export formats (PDF, Word, JSON)",
        "Priority email support",
        "Advanced analytics & insights",
        "Custom templates",
        "Version history",
        "Additional tokens: $0.005/token"
      ],
      popular: true,
      cta: "Start 14-Day Trial"
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited everything",
        "Unlimited AI tokens",
        "Unlimited team members",
        "White-label branding",
        "Custom integrations & API",
        "Dedicated account manager",
        "24/7 phone support",
        "SSO & advanced security",
        "Custom SLA",
        "On-premise deployment option"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const stats = [
    { number: "50+", label: "SOP Templates", icon: "📚" },
    { number: "AI", label: "Powered Analysis", icon: "🤖" },
    { number: "2", label: "User Roles", icon: "👥" },
    { number: "99%", label: "Uptime SLA", icon: "⚡" }
  ];

  const useCases = [
    {
      icon: "🏭",
      title: "Manufacturing",
      description: "Standardize production processes, quality control procedures, and safety protocols."
    },
    {
      icon: "🏥",
      title: "Healthcare",
      description: "Document patient care procedures, compliance protocols, and clinical workflows."
    },
    {
      icon: "💼",
      title: "Corporate",
      description: "Create employee onboarding, HR processes, and departmental procedures."
    },
    {
      icon: "🛒",
      title: "Retail & E-commerce",
      description: "Streamline order fulfillment, customer service, and inventory management processes."
    },
    {
      icon: "🎓",
      title: "Education",
      description: "Document teaching methodologies, administrative processes, and student support workflows."
    },
    {
      icon: "🔧",
      title: "IT & DevOps",
      description: "Create deployment procedures, incident response playbooks, and system maintenance SOPs."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px 80px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            📋 Kovari SOP Platform
          </h1>
          <p style={{ 
            fontSize: '24px', 
            marginBottom: '30px',
            opacity: 0.95 
          }}>
            AI-Powered Standard Operating Procedure Creation & Management
          </p>
          <p style={{ 
            fontSize: '18px', 
            marginBottom: '40px',
            opacity: 0.9 
          }}>
            Create, optimize, and manage your SOPs with intelligent AI analysis and beautiful visualizations
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="#pricing" 
              style={{
                background: 'white',
                color: '#667eea',
                padding: '15px 40px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: 'bold',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              View Pricing
            </a>
            <a 
              href="#features" 
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: 'bold',
                textDecoration: 'none',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'white';
              }}
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '60px 20px',
        background: '#f8f9fa'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '30px',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{stat.icon}</div>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '16px', color: '#666' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 20px', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '20px',
            color: '#333'
          }}>
            ✨ Complete Feature Set
          </h2>
          <p style={{ 
            fontSize: '20px', 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Everything you need to create, manage, and optimize your Standard Operating Procedures
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '15px',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  marginBottom: '20px',
                  color: '#333',
                  textAlign: 'center'
                }}>
                  {feature.category}
                </h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0
                }}>
                  {feature.items.map((item, i) => (
                    <li key={i} style={{ 
                      padding: '10px 0',
                      borderBottom: i < feature.items.length - 1 ? '1px solid #dee2e6' : 'none',
                      color: '#555',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}>
                      <span style={{ color: '#667eea', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{ 
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '20px',
            color: '#333'
          }}>
            🎯 Perfect For Any Industry
          </h2>
          <p style={{ 
            fontSize: '20px', 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Kovari adapts to your industry's unique needs
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {useCases.map((useCase, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>{useCase.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                  {useCase.title}
                </h3>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ 
        padding: '80px 20px',
        background: 'white'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '60px',
            color: '#333'
          }}>
            🚀 Transform Your Operations
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                icon: "⚡",
                title: "80% Faster SOP Creation",
                description: "AI-powered tools help you create comprehensive SOPs in minutes, not days."
              },
              {
                icon: "🎯",
                title: "Eliminate Process Gaps",
                description: "Intelligent gap detection ensures no steps are missed in critical workflows."
              },
              {
                icon: "📈",
                title: "Boost Team Efficiency",
                description: "Clear, visual workflows improve understanding and reduce training time by 60%."
              },
              {
                icon: "🔄",
                title: "Continuous Improvement",
                description: "Analytics show bottlenecks and opportunities for optimization."
              },
              {
                icon: "✅",
                title: "Ensure Compliance",
                description: "Track changes, maintain version history, and prove adherence to standards."
              },
              {
                icon: "💡",
                title: "Smart Recommendations",
                description: "AI suggests improvements based on industry best practices."
              }
            ].map((benefit, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>{benefit.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                  {benefit.title}
                </h3>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '80px 20px', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '20px',
            color: '#333'
          }}>
            💎 Simple, Transparent Pricing
          </h2>
          <p style={{ 
            fontSize: '20px', 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '60px',
            maxWidth: '600px',
            margin: '0 auto 60px'
          }}>
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {pricingPlans.map((plan, index) => (
              <div key={index} style={{
                background: plan.popular ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                color: plan.popular ? 'white' : '#333',
                padding: '40px 30px',
                borderRadius: '20px',
                border: plan.popular ? 'none' : '2px solid #e9ecef',
                position: 'relative',
                boxShadow: plan.popular ? '0 10px 40px rgba(102, 126, 234, 0.4)' : '0 4px 15px rgba(0,0,0,0.1)',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ffd700',
                    color: '#333',
                    padding: '5px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}>
                    ⭐ MOST POPULAR
                  </div>
                )}

                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>
                  {plan.name}
                </h3>

                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 'bold' }}>{plan.price}</span>
                  <span style={{ fontSize: '18px', opacity: 0.8 }}>{plan.period}</span>
                </div>

                <p style={{ 
                  textAlign: 'center', 
                  marginBottom: '30px',
                  opacity: 0.9,
                  fontSize: '16px'
                }}>
                  {plan.description}
                </p>

                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  marginBottom: '30px'
                }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ 
                      padding: '12px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '15px',
                      opacity: plan.popular ? 1 : 0.8
                    }}>
                      <span style={{ 
                        color: plan.popular ? '#ffd700' : '#667eea', 
                        fontWeight: 'bold',
                        flexShrink: 0,
                        fontSize: '18px'
                      }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  border: 'none',
                  background: plan.popular ? 'white' : '#667eea',
                  color: plan.popular ? '#667eea' : 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: '40px',
            color: '#666',
            fontSize: '16px'
          }}>
            🎁 <strong>14-day free trial</strong> on paid plans • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            marginBottom: '20px'
          }}>
            Ready to Streamline Your Processes?
          </h2>
          <p style={{ 
            fontSize: '20px', 
            marginBottom: '40px',
            opacity: 0.95
          }}>
            Join innovative teams using Kovari to create world-class Standard Operating Procedures.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.href = '/signup'}
              style={{
                background: 'white',
                color: '#667eea',
                padding: '18px 50px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => window.location.href = '/book'}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '18px 50px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: '2px solid white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'white';
              }}
            >
              Schedule Demo
            </button>
          </div>

          <p style={{ 
            marginTop: '30px',
            fontSize: '16px',
            opacity: 0.9
          }}>
            ✓ No credit card required  •  ✓ Setup in minutes  •  ✓ Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}


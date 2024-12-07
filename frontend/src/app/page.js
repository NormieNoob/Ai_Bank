import Link from 'next/link';
import Image from 'next/image';
import './styles/home.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaInstagram, FaDribbble } from 'react-icons/fa';

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="nav-brand">SecureBank</div>
        <div className="nav-links">
          <Link href="/signin" className="nav-link">Sign In</Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Feature Cards */}
      <section className="features-section">
        <h2 className="section-title">Banking Made Simple</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={48}
                height={48}
                className="feature-icon"
              />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-section">
        <h2 className="section-title">Choose Your Plan</h2>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="pricing-card">
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="amount">${plan.price}</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="brand-name">SECUREBANK</h3>
            <p className="brand-description">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
              Id odit ullam iste repellat consequatur libero reiciendis, 
              blanditiis accusantium.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" aria-label="Dribbble">
                <FaDribbble />
              </a>
            </div>
          </div>
          
          <div className="footer-links-grid">
            {footerLinks.map((column, index) => (
              <div key={index} className="footer-links-column">
                <h4>{column.title}</h4>
                <ul>
                  {column.links.map((link, idx) => (
                    <li key={idx}>
                      <Link href="#">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SecureBank. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: '/icons/savings-acc-icon.png',
    title: 'Savings Accounts',
    description: 'Earn competitive interest rates with our flexible savings accounts designed to help you reach your financial goals.'
  },
  {
    icon: '/icons/checking-acc-icon.png',
    title: 'Checking Accounts',
    description: 'Manage your daily transactions with ease using our feature-rich checking accounts with zero monthly fees.'
  },
  {
    icon: '/icons/credit-card-icon.png',
    title: 'Credit Cards',
    description: 'Get rewarded for your spending with our premium credit cards offering cashback and travel rewards.'
  }
];

const benefits = [
  {
    stat: '99.9%',
    title: 'Uptime',
    description: 'Reliable banking services available whenever you need them'
  },
  {
    stat: '2M+',
    title: 'Users',
    description: 'Trusted by millions of customers worldwide'
  },
  {
    stat: '24/7',
    title: 'Support',
    description: 'Round-the-clock customer service and assistance'
  },
  {
    stat: '128-bit',
    title: 'Security',
    description: 'Bank-grade encryption for your financial data'
  }
];

const footerLinks = [
  {
    title: 'Company',
    links: ['About', 'Blog', 'Jobs', 'Press', 'Careers', 'Partners']
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'Support']
  }
];

// Add this new pricing plans data
const pricingPlans = [
  {
    name: 'Basic',
    price: '0',
    features: [
      'Free checking account',
      'Mobile banking app',
      'Basic customer support',
      'Debit card included',
      'Up to 2 ATM withdrawals/month'
    ]
  },
  {
    name: 'Plus',
    price: '4.99',
    features: [
      'Everything in Basic',
      'Premium credit card options',
      'Priority customer support',
      'Unlimited ATM withdrawals',
      'Investment account access',
      'Financial advisory services'
    ]
  },
  {
    name: 'Pro',
    price: '9.99',
    features: [
      'Everything in Premium',
      'Multiple business accounts',
      'Payroll services',
      'Business loans',
      'Dedicated account manager',
      'API access for integration'
    ]
  }
];

import React, { Component } from 'react';
import './Legal.css';
import withContainer from "../../components/withContainer";

class Legal extends Component {
  render() {
      return (
            <div className="d-flex justify-content-center">
              <article id="content">
                <header id="pagmt">
                  <h1>Privacy Policy</h1>
                  <p>Last updated: February 18, 2019</p>
                </header>

                <section>
                  <h3 id="welcome-to-Ignite">Welcome to Ignite!</h3>

                  <p>Ignite, Inc. and its affiliates (collectively “Ignite”, “we” and “us”) respect your privacy. We offer
                    services that enable you to learn about full stack development.</p>
                  <p>This Global Privacy Policy describes the types of <a href="#personal-data-definition">Personal
                    Data</a> we collect through our products and services (“Services”) and via our online
                    presence, which include our main website at <a href="https://ignitecode.net">Ignite.com</a>, as well
                    as services and websites that we enable Internet users to access, (collectively, our “Sites”). This policy also
                    describes how we use Personal Data, with whom
                    we share it, your rights and choices, and how you can contact us about our privacy practices. This
                    policy does not apply to third-party websites, products, or services, even if they link to our
                    Services or Sites, and you should consider the privacy practices of those third-parties carefully.</p>

                  <p>This Privacy Policy is provided in a layered format. Click through to jump to a specific section.</p>

                  <ul>
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#personal-data-definition">Personal Data We Collect</a></li>
                    <li><a href="#how-we-use-personal-data">How We Use Personal Data</a></li>
                    <li><a href="#how-we-disclose-personal-data">How We Disclose Personal Data</a></li>
                    <li><a href="#your-rights-and-choices">Your Rights and Choices</a></li>
                    <li><a href="#security-and-retention">Security and Retention</a></li>
                    <li><a href="#international-data-transfers">International Data Transfers</a></li>
                    <li><a href="#use-by-minors">Use by Minors</a></li>
                    <li><a href="#updates-to-this-privacy-policy-and-notifications">Updates To this Privacy Policy</a>
                    </li>
                    <li><a href="#links-to-other-websites">Links To Other Websites</a></li>
                    <li><a href="#jurisdiction-specific-provisions">Jurisdiction-specific Provisions</a></li>
                    <li><a href="#contact-us">Contact Us</a></li>
                  </ul>

                  <h3 id="overview">1. Overview<a className="anchor" href="#overview">{null}</a></h3>

                  <p>Ignite obtains Personal Data about you from various sources to provide our Services and to manage our
                    Sites. “You” may be a visitor to one of our websites, a user of one or more of our Services (“User” or
                    “Ignite User”), or a customer of a User (“Customer”). If you are a Customer, Ignite will generally not
                    collect your Personal Data directly from you. Your agreement with the relevant Ignite User should
                    explain how the Ignite User shares your Personal Data with Ignite, and if you have questions about
                    this sharing, then you should direct those questions to the Ignite User.</p>
                  <div className="collapsable">
                    <div><h4 id="overview-learn-more">Learn more<a className="anchor" href="#overview-learn-more">{null}</a></h4>
                    </div>
                    <div>
                      <br />
                        <p><strong>a. Site visitors.</strong></p>

                        <p>If you visit or use our Sites, we may collect Personal Data. For example, we collect Personal
                          Data that you submit to us via online forms and surveys, and when you contact us by email.</p>

                        <p><strong>b. Payment processing services (Ignite as a data processor).</strong></p>

                        <p>As a processor of payment transactions and provider of related services, we may collect, use
                          and disclose Personal Data about Customers when we act as a Ignite User’s service provider.
                          Ignite Users are responsible for making sure that the Customer’s privacy rights are respected,
                          including ensuring appropriate disclosures about third party data collection and use. To the
                          extent that we are acting as a Ignite User’s data processor, we will process Personal Data in
                          accordance with the terms of our agreement with the Ignite User and the Ignite User’s lawful
                          instructions. If you are a Customer and would like to obtain more information about how a Ignite
                          User uses third party services like Ignite to process your Personal Data in the context of
                          payment transactions, please contact the Ignite User directly or visit the Ignite User’s privacy
                          policy.</p>

                        <p><strong>c. Fraud prevention activities and activities for offering a compliant and secure
                          platform.</strong></p>

                        <p>The collection and use of Personal Data is critical in helping us to ensure that our platform
                          and services are safe, secure and compliant.</p>
                    </div>
                  </div>

                  <h3 id="personal-data-definition">2. Personal Data We Collect<a className="anchor" href="#personal-data-definition">{null}</a>
                  </h3>

                  <p><strong>a. Personal Data that we collect about you.</strong></p>

                  <p><strong>Personal Data</strong> is any information that relates to an identified or identifiable
                    individual. The Personal Data that you provide directly to us through our Sites will be apparent from
                    the context in which you provide the data. In particular:</p>

                  <ul>
                    <li>When you register for a Ignite account we collect your full name, email address, and account
                      log-in credentials.
                    </li>
                    <li>When you fill-in our online form to contact our sales team, we collect your full name, work email,
                      country, and anything else you tell us about your project, needs and timeline.
                    </li>
                    <li>When you use the “Remember Me” feature of Ignite Checkout, we collect your email address, payment
                      card number, CVC code and expiration date however we do not store this information. It is stored by
                      an independent third party <a href="https://stripe.com">Stripe</a>. This information is processed by
                      Stripe and a token is returned to use representing your credit card credentials.
                    </li>
                  </ul>

                  <p>When you respond to Ignite emails or surveys we collect your email address, name and any other
                    information you choose to include in the body of your email or responses. If you contact us by phone,
                    we will collect the phone number you use to call Ignite. If you contact us by phone as a Ignite User,
                    we may collect additional information in order to verify your identity.</p>

                  <p>If you are a Ignite User, you will provide your contact details, such as name, postal address,
                    telephone number, and email address. As part of your business relationship with us, we may also
                    receive financial and personal information about you, such as your date of birth and government
                    identifiers associated with you and your organization (such as your social security number, tax
                    number, or Employer Identification Number).</p>

                  <p>If you are a Customer, when you make payments or conduct transactions through a Ignite User’s website
                    or application, we will receive your transaction information. Depending on how the Ignite User
                    implements our Services, we may receive this information directly from you, or from the Ignite User or
                    third parties. The information that we collect will include payment method information (such as credit
                    or debit card number, or bank account information), purchase amount, date of purchase, and payment
                    method. Different payment methods may require the collection of different categories of information.
                    The Ignite User will determine the payment methods that it enables you to use, and the payment method
                    information that we collect will depend upon the payment method that you choose to use from the list
                    of available payment methods that are offered to you by the Ignite User.</p>

                  <p>You may also choose to submit information to us via other methods, including: (i) in response to
                    marketing or other communications, (ii) through social media or online forums, (iii) through
                    participation in an offer, program or promotion, (iv) in connection with an actual or potential
                    business relationship with us, or (v) by giving us your business card or contact details at trade
                    shows or other events.</p>

                  <p><strong>b. Information that we collect automatically on our Sites.</strong></p>

                  <p>Our Sites use cookies and other technologies to function effectively. These technologies record
                    information about your use of our Sites, including:</p>

                  <ul>
                    <li><strong>Browser and device data</strong>, such as IP address, device type, operating system and
                      Internet browser type, screen resolution, operating system name and version, device manufacturer and
                      model, language, plug-ins, add-ons and the language version of the Sites you are visiting;
                    </li>
                    <li><strong>Usage data</strong>, such as time spent on the Sites, pages visited, links clicked,
                      language preferences, and the pages that led or referred you to our Sites.
                    </li>
                  </ul>

                  <p>We also may collect information about your online activities on websites and connected devices over
                    time and across third-party websites, devices, apps and other online features and services. We use
                    Google Analytics on our Sites to help us analyze Your use of our Sites and diagnose technical
                    issues.</p>

                  <p>To learn more about the cookies that may be served through our Sites and how You can control our use
                    of cookies and third-party analytics, please see our <a
                        href="https://www.Ignite.com/cookies-policy/legal">Cookie Policy</a>.</p>

                  <h3 id="how-we-use-personal-data">
                    3. How We Use Personal Data
                    <a className="anchor" href="#how-we-use-personal-data">{null}</a>
                  </h3>

                  <p><strong>a. Our products and services.</strong></p>

                  <p>We rely upon a number of legal grounds to ensure that our use of your Personal Data is compliant with
                    applicable law. We use Personal Data to facilitate the business relationships we have with our Users,
                    to comply with our financial regulatory and other legal obligations, and to pursue our legitimate
                    business interests. We also use Personal Data to complete payment transactions and to provide
                    payment-related services to our Users.</p>
                  <div className="collapsable">
                    <div>
                      <h4 id="personal-data-learn-more">
                        Learn more<a className="anchor" href="#personal-data-learn-more">{null}</a>
                      </h4>
                    </div>
                    <div>
                      <br />
                        <p><strong>Contractual and pre-contractual business relationships.</strong> We use Personal Data
                          for the purpose of entering into business relationships with prospective Ignite Users, and to
                          perform the contractual obligations under the contacts that we have with Ignite Users.
                          Activities that we conduct in this context include:</p>

                        <ul>
                          <li>Creation and management of Ignite accounts and Ignite account credentials, including the
                            evaluation of applications to commence or expand the use of our Services;
                          </li>
                          <li>Creation and management of Ignite Checkout accounts;</li>
                          <li>Accounting, auditing, and billing activities; and</li>
                          <li>Processing of payments with Ignite Checkout, communications regarding such payments, and
                            related customer service.
                          </li>
                        </ul>

                        <p><strong>Legal and regulatory compliance.</strong> We use Personal Data to verify the identity
                          of our Users in order to comply with fraud monitoring, prevention and detection obligations,
                          laws associated with the identification and reporting of illegal and illicit activity, such as
                          AML (Anti-Money Laundering) and KYC (Know-Your-Customer) obligations, and financial reporting
                          obligations. For example, we may be required to record and verify a User’s identity for the
                          purpose of compliance with legislation intended to prevent money laundering and financial
                          crimes. These obligations are imposed on us by the operation of law, industry standards, and by
                          our financial partners, and may require us to report our compliance to third parties, and to
                          submit to third party verification audits.</p>

                        <p><strong>Legitimate business interests.</strong> We rely on our legitimate business interests to
                          process Personal Data about you. The following list sets out the business purposes that we have
                          identified as legitimate. In determining the content of this list, we balanced our interests
                          against the legitimate interests and rights of the individuals whose Personal Data we process.
                          We:</p>

                        <ul>
                          <li>Monitor, prevent and detect fraud and unauthorized payment transactions;</li>
                          <li>Mitigate financial loss, claims, liabilities or other harm to Users and Ignite;</li>
                          <li>Respond to inquiries, send service notices and provide customer support;</li>
                          <li>Promote, analyze, modify and improve our products, systems, and tools, and develop new
                            products and services;
                          </li>
                          <li>Manage, operate and improve the performance of our Sites and Services by understanding their
                            effectiveness and optimizing our digital assets;
                          </li>
                          <li>Analyze and advertise our products and services;</li>
                          <li>Conduct aggregate analysis and develop business intelligence that enable us to operate,
                            protect, make informed decisions, and report on the performance of, our business;
                          </li>
                          <li>Share Personal Data with third party service providers that provide services on our behalf
                            and business partners which help us operate and improve our business;
                          </li>
                          <li>Ensure network and information security throughout Ignite and our Services; and</li>
                          <li>Transmit Personal Data within our affiliates for internal administrative purposes.</li>
                        </ul>

                        <p><strong>Payment transactions and related services (Ignite as a data processor).</strong> As a
                          processor of payment transactions, we use Personal Data of our User’s Customers to process
                          online payment transactions on behalf of our Users. All such use is pursuant to the terms of our
                          business relationships with our Users. In addition, we may offer payment-related services to
                          Users who have requested such services, and our delivery of such related services to our Users
                          may involve the use of Personal Data. For example, a Ignite User may specify parameters for
                          transactions submitted by its Customers that determine whether the transactions are blocked or
                          allowed by our platform. The entity responsible for the collection and use of Customer’s
                          Personal Data in the context of payment transactions and payment-related services is the User.
                        </p>

                        <p>If we need to use your Personal Data in other ways, we will provide specific notice at the time
                          of collection and obtain your consent where required by applicable law.</p>
                      </div>
                  </div>

                  <p><strong>b. Marketing and events-related communications.</strong></p>

                  <p>We may send you email marketing communications about Ignite products and services, invite you to
                    participate in our events or surveys, or otherwise communicate with you for marketing purposes,
                    provided that we do so in accordance with the consent requirements that are imposed by applicable law.
                    When we collect your business contact details through our participation at trade shows or other
                    events, we may use the information to follow-up with you regarding an event, send you information that
                    you have requested on our products and services and, with your permission, include you on our
                    marketing information campaigns.</p>

                  <p><strong>c. Interest-based advertising.</strong></p>

                  <p>When you visit our Sites or online services, both we and certain third parties collect information
                    about your online activities over time and across different sites to provide you with advertising
                    about products and services tailored to your individual interests (this type of advertising is called
                    “interest-based advertising”). These third parties may place or recognize a unique cookie or other
                    technology on your browser (including the use of pixel tags). Where required by applicable law, we
                    will obtain your consent prior to processing of your information for the purpose of interest-based
                    advertising.</p>

                  <p>You may see our ads on other websites or mobile apps because we participate in advertising networks.
                    Ad networks allow us to target our messaging to users based on a range of factors, including
                    demographic data, users’ inferred interests and browsing context (for example, the time and date of
                    your visit to our Sites, the pages that you viewed, and the links that you clicked on). This
                    technology also helps us track the effectiveness of our marketing efforts and understand if you have
                    seen one of our advertisements.</p>

                  <p>We work with Google AdWords, Doubleclick, AdRoll and other advertising networks. To learn how to opt
                    out of behavioral advertising delivered by Network Advertising Initiative member companies, please
                    visit the <a href="http://www.networkadvertising.org/managing/opt_out.asp">Network Advertising
                      Initative</a> and <a href="http://www.aboutads.info/">Digital Advertising Alliance</a>. You may
                    download the <a href="http://youradchoices.com/appchoices">AppChoices app</a> to opt out in mobile
                    apps. If you opt out from interest-based advertising, you may see advertising that is not relevant to
                    you. At present, there is no industry standard for recognizing Do Not Track browser signals, so we do
                    not respond to them.</p>

                  <h3 id="how-we-disclose-personal-data">
                    4. How We Disclose Personal Data.
                    <a className="anchor" href="#how-we-disclose-personal-data">{null}</a>
                  </h3>

                  <p>Ignite does not sell or rent Personal Data to marketers or unaffiliated third parties. We share your
                    Personal Data with trusted entities, as outlined below.</p>

                  <p><strong>a. Ignite.</strong> We share Personal Data with other Ignite entities in order to provide our
                    Services and for internal administration purposes.</p>

                  <p><strong>b. Service providers.</strong> We share Personal Data with a limited number of our service
                    providers. We have service providers that provide services on our behalf, such as identity
                    verification services, website hosting, data analysis, information technology and related
                    infrastructure, customer service, email delivery, and auditing services. These service providers may
                    need to access Personal Data to perform their services. We authorize such service providers to use or
                    disclose the Personal Data only as necessary to perform services on our behalf or comply with legal
                    requirements. We require such service providers to contractually commit to protect the security and
                    confidentiality of Personal Data they process on our behalf. Our service providers are predominantly
                    located in the European Union and the United States of America.</p>

                  <p><strong>d. Our Users and third parties authorized by our Users.</strong> We share Personal Data with
                    Users as necessary to maintain a User account and provide the Services. We share data with parties
                    directly authorized by a User to receive Personal Data, such as when a User authorizes a third party
                    application provider to access the User’s Ignite account The use of Personal Data by an authorized third party is subject to the third party’s
                    privacy policy.</p>

                  <p><strong>e. Corporate transactions.</strong> In the event that we enter into, or intend to enter into,
                    a transaction that alters the structure of our business, such as a reorganization, merger, sale, joint
                    venture, assignment, transfer, change of control, or other disposition of all or any portion of our
                    business, assets or stock, we may share Personal Data with third parties for the purpose of
                    facilitating and completing the transaction.</p>

                  <p><strong>f. Compliance and harm prevention.</strong> We share Personal Data as we believe necessary:
                    (i) to comply with applicable law, or payment method rules; (ii) to enforce our contractual rights;
                    (iii) to protect the rights, privacy, safety and property of Ignite, you or others; and (iv) to
                    respond to requests from courts, law enforcement agencies, regulatory agencies, and other public and
                    government authorities, which may include authorities outside your country of residence.</p>

                  <h3 id="your-rights-and-choices">5. Your Rights and Choices.<a className="anchor" href="#your-rights-and-choices">{null}</a></h3>

                  <p>You have choices regarding our use and disclosure of your Personal Data:</p>

                  <p><strong>a. Opting out of receiving electronic communications from us.</strong> If you no longer want
                    to receive marketing-related emails from us, you may opt-out via the unsubscribe link included in such
                    emails. We will try to comply with your request(s) as soon as reasonably practicable. Please note that
                    if you opt-out of receiving marketing-related emails from us, we may still send you important
                    administrative messages that are required to provide you with our Services.</p>

                  <p><strong>b. How you can see or change your account Personal Data.</strong> If You would like to
                    review, correct, or update Personal Data that You have previously disclosed to us, You may do so by
                    signing in to your Ignite account or by <a href="https://ignitecode.net/contact">contacting us</a>.</p>

                  <p><strong>c. Your data protection rights.</strong> Depending on your location and subject to applicable
                    law, you may have the following rights with regard to the Personal Data we control about you:</p>

                  <ul>
                    <li>The right to request confirmation of whether Ignite processes Personal Data relating to you, and
                      if so, to request a copy of that Personal Data;
                    </li>
                    <li>The right to request that Ignite rectifies or updates your Personal Data that is inaccurate,
                      incomplete or outdated;
                    </li>
                    <li>The right to request that Ignite erase your Personal Data in certain circumstances provided by
                      law;
                    </li>
                    <li>The right to request that Ignite restrict the use of your Personal Data in certain circumstances,
                      such as while Ignite considers another request that you have submitted (including a request that
                      Ignite make an update to your Personal Data); and
                    </li>
                    <li>The right to request that we export to another company, where technically feasible, your Personal
                      Data that we hold in order to provide Services to you.
                    </li>
                  </ul>

                  <p>Where the processing of your Personal Data is based on your previously given consent, you have the
                    right to withdraw your consent at any time. You may also have the right to object to the processing of
                    your Personal Data on grounds relating to your particular situation.</p>

                  <p><strong>d. Process for exercising data protection rights.</strong> In order to exercise your data
                    protection rights, you may contact Ignite as described in the <a href="#contact-us">Contact
                      Us</a> section below. We take each request seriously. We will comply with your request to the extent
                    required by applicable law. We will not be able to respond to a request if we no longer hold your
                    Personal Data. If you feel that you have not received a satisfactory response from us, you may consult
                    with the data protection authority in your country.</p>

                  <p>For your protection, we may need to verify your identity before responding to your request, such as
                    verifying that the email address from which you send the request matches your email address that we
                    have on file. If we no longer need to process Personal Data about you in order to provide our Services
                    or our Sites, we will not maintain, acquire or process additional information in order to identify you
                    for the purpose of responding to your request.</p>

                  <p>If you are a Customer of a Ignite User, please direct your requests directly to the User. For
                    example, if you are making, or have made, a purchase from a merchant using Ignite as a payment
                    processor, and you have a request that is related to the payment information that you provided as part
                    of the purchase transaction, then you should address your request directly to the merchant.</p>

                  <h3 id="security-and-retention">6. Security and Retention.<a className="anchor" href="#security-and-retention">{null}</a></h3>

                  <p>We make reasonable efforts to ensure a level of security appropriate to the risk associated with the
                    processing of Personal Data. We maintain organizational, technical and administrative measures
                    designed to protect Personal Data within our organization against unauthorized access, destruction,
                    loss, alteration or misuse. Your Personal Data is only accessible to a limited number of personnel who
                    need access to the information to perform their duties. Unfortunately, no data transmission or storage
                    system can be guaranteed to be 100% secure. If you have reason to believe that your interaction with
                    us is no longer secure (for example, if you feel that the security of your account has been
                    compromised), please <a href="https://Ignite.com/contact">contact us</a> immediately.</p>

                  <p>If you are a Ignite User, we retain your Personal Data as long as we are providing the Services to
                    you. We retain Personal Data after we cease providing Services to you, even if you close your Ignite
                    account, to the extent necessary to comply with our legal and regulatory obligations, and for the
                    purpose of fraud monitoring, detection and prevention. We also retain Personal Data to comply with our
                    tax, accounting, and financial reporting obligations, where we are required to retain the data by our
                    contractual commitments to our financial partners, and where data retention is mandated by the payment
                    methods that we support. Where we retain data, we do so in accordance with any limitation periods and
                    records retention obligations that are imposed by applicable law.</p>

                  <h3 id="international-data-transfers">
                    7. International Data Transfers.<a className="anchor" href="#international-data-transfers">{null}</a>
                  </h3>

                  <p>We are a global business. Personal Data may be stored and processed in any country where we have
                    operations or where we engage service providers. We may transfer Personal Data that we maintain about
                    you to recipients in countries other than the country in which the Personal Data was originally
                    collected, including to the United States. Those countries may have data protection rules that are
                    different from those of your country. However, we will take measures to ensure that any such transfers
                    comply with applicable data protection laws and that your Personal Data remains protected to the
                    standards described in this Privacy Policy. In certain circumstances, courts, law enforcement
                    agencies, regulatory agencies or security authorities in those other countries may be entitled to
                    access your Personal Data.</p>

                  <p>If you are located in the European Economic Area (“EEA”) or Switzerland, we comply with applicable
                    laws to provide an adequate level of data protection for the transfer of your Personal Data to the US.
                    Ignite Inc. is certified under the EU-U.S. and the Swiss-U.S. Privacy Shield Framework and adheres to
                    the Privacy Shield Principles. For more, see Ignite’s <a
                        href="https://www.Ignite.com/privacy-shield-policy">Privacy Shield Policy</a>. In addition, we
                    have implemented intra-group data transfer agreements which you may view upon request.</p>

                  <p>Where applicable law requires us to ensure that an international data transfer is governed by a data
                    transfer mechanism, we use one or more of the following mechanisms: EU Standard Contractual Clauses
                    with a data recipient outside the EEA, verification that the recipient has implemented Binding
                    Corporate Rules, or verification that the recipient adheres to the EU-US and Swiss-US Privacy Shield
                    Framework.</p>

                  <h3 id="use-by-minors">8. Use by Minors.<a className="anchor" href="#use-by-minors">{null}</a></h3>

                  <p>The Services are not directed to individuals under the age of thirteen (13), and we request that they
                    not provide Personal Data through the Services.</p>

                  <h3 id="updates-to-this-privacy-policy-and-notifications">9. Updates To this Privacy Policy and
                    Notifications.<a className="anchor" href="#updates-to-this-privacy-policy-and-notifications">{null}</a></h3>

                  <p>We may change this Privacy Policy from time to time to reflect new services, changes in our Personal
                    Data practices or relevant laws. The “Last updated” legend at the top of this Privacy Policy indicates
                    when this Privacy Policy was last revised. Any changes are effective when we post the revised Privacy
                    Policy on the Services. We may provide you with disclosures and alerts regarding the Privacy Policy or
                    Personal Data collected by posting them on our website and, if you are a User, by contacting you
                    through your Ignite Dashboard, email address and/or the physical address listed in your Ignite
                    account.</p>

                  <h3 id="links-to-other-websites">
                    10. Links To Other Websites.<a className="anchor" href="#links-to-other-websites">{null}</a>
                  </h3>

                  <p>The Services may provide the ability to connect to other websites. These websites may operate
                    independently from us and may have their own privacy notices or policies, which we strongly suggest
                    you review. If any linked website is not owned or controlled by us, we are not responsible for its
                    content, any use of the website or the privacy practices of the operator of the website.</p>

                  <h3 id="contact-us">12. Contact Us<a className="anchor" href="#contact-us">{null}</a></h3>

                  <p>If You have any questions or complaints about this Privacy Policy, please <a
                      href="https://ignitecode.net/contact">contact us</a> electronically or send physical mail to:</p>
                </section>
              </article>
            </div>
      )
  }
}

export default withContainer(Legal);

import React, {Component} from 'react';
import './Legal.css';
import './CookiePolicy.css'
import withContainer from "../../components/withContainer";

class CookiePolicy extends Component {
    render() {
        return (
                <div className="d-flex justify-content-center">
                    <article id="content">
                        <header id="cagmt">
                            <h1>Cookies and Similar Technologies</h1>
                            <p>Last updated: February 18, 2019</p>
                        </header>

                        <section>
                            <p>Cookies are small text files that are stored in a computer’s web browser memory. They
                                help website providers with things like understanding how people use a website,
                                remembering a User’s login details, and storing website preferences. This page explains
                                how we use cookies and other similar technologies to help us ensure that our Services
                                function properly. Any
                                capitalized term used and not otherwise defined below has the meaning assigned to it in
                                the Privacy Policy.</p>

                            <h3 id="how-we-use-cookies">1. How We Use Cookies.<a className="anchor" href="#how-we-use-cookies">{null}</a></h3>

                            <p>Cookies play an important role in helping us provide personal, effective and safe
                                Services. We use cookies on our website. We change the cookies periodically as we
                                improve or add to our Services, but we generally use cookies for the following
                                purposes:</p>

                            <p><strong>a. To Operate Our Services.</strong> Some cookies are essential to the operation
                                of our website and Services. We use those cookies in a number of different ways,
                                including:</p>

                            <ul>
                                <li><strong>Site Features and Services.</strong> We use cookies to remember how You
                                    prefer to use our Services so that You don’t have to reconfigure Your settings each
                                    time You log into Your account. For example the
                                    “Remember Me” feature to store Your payment details for faster checkout with
                                    participating merchants. A cookie helps us associate Your device with the payment
                                    details You provide when You sign up for the “Remember Me” feature.
                                </li>
                            </ul>

                            <p><strong>b. To Analyze and Improve Our Services.</strong> Cookies help us understand how
                                to make our website and Services work better for You. Cookies tell us how people reach
                                our website and our Users’ websites and they give us insights into improvements or
                                enhancements we need to make to our website and Services.</p>

                            <p><strong>c. For Better Advertising.</strong> Cookies can help us provide more effective
                                advertising on our website. For example, we might use a cookie to help prevent You from
                                seeing the same advertisement multiple times or to measure how many times an
                                advertisement is viewed or clicked on.</p>

                            <h3 id="how-we-use-other-technologies">2. How We Use Other Technologies<a className="anchor" href="#how-we-use-other-technologies">{null}</a>
                            </h3>

                            <p><strong>a. Pixel tags.</strong> Pixel tags (also known as web beacons and clear GIFs) may
                                be used in connection with some Services to, among other things, track the actions of
                                Users (such as email recipients), measure the success of our marketing campaigns and
                                compile statistics about usage of the Services and response rates.</p>

                            <p><strong>b. Third Party Analytics.</strong> We use Google Analytics, which uses cookies
                                and similar technologies, to collect and analyze information about use of the Services
                                and report on activities and trends. This service may also collect information regarding
                                the use of other websites, apps and online resources. You can learn about Google’s
                                practices on the <a href="https://www.google.com/policies/privacy/partners/">Google
                                    website</a>. Please refer to the table below for more on how we use third party
                                analytics.</p>

                            <p><strong>c. Flash Cookies.</strong> We may use Adobe Flash and other technologies to,
                                among other things, collect and store information about Your use of the Services. If You
                                want to block or control flash cookies, You can adjust Your settings.</p>

                            <h3 id="how-to-manage-cookies">3. How To Manage Cookies<a className="anchor" href="#how-to-manage-cookies">{null}</a>
                            </h3>

                            <p>Your web browser may allow You to change Your cookie preferences, including to delete and
                                disable ignite code cookies. Please consult the help section of Your web browser or
                                follow
                                the links below to understand Your options, but please note that if You choose to
                                disable the cookies, some features of our website or Services may not operate as
                                intended.</p>

                            <ul>
                                <li>Chrome: <a
                                    href="https://support.google.com/chrome/answer/95647?hl=en">https://support.google.com/chrome/answer/95647?hl=en</a>
                                </li>
                                <li>Explorer: <a
                                    href="https://support.microsoft.com/en-us/products/windows?os=windows-10">https://support.microsoft.com/en-us/products/windows?os=windows-10</a>
                                </li>
                                <li>Safari: <a
                                    href="https://support.apple.com/kb/PH21411">https://support.apple.com/kb/PH21411</a>
                                </li>
                                <li>Firefox: <a
                                    href="https://support.mozilla.org/products/firefox/cookies">https://support.mozilla.org/products/firefox/cookies</a>
                                </li>
                                <li>Opera: <a
                                    href="http://www.opera.com/help/tutorials/security/cookies/">http://www.opera.com/help/tutorials/security/cookies/</a>
                                </li>
                            </ul>

                            <h3 id="cookie-table">4. Cookie Table<a className="anchor" href="#cookie-table">{null}</a></h3>

                            <p>Cookies that we commonly use are listed below. This list is not exhaustive, but describes
                                the main reasons we typically set cookies.</p>

                            <h4 id="stripe-cookies">Ignite cookies<a className="anchor"
                                                                     href="#stripe-cookies">{null}</a></h4>

                            <table className="alternate">
                                <thead>
                                <tr>
                                    <th>Cookie Name</th>
                                    <th>Purpose</th>
                                    <th>Persistent or session</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>accounts</td>
                                    <td>Lists User accounts</td>
                                    <td>Persistent</td>
                                </tr>
                                <tr>
                                    <td>ignite.csrf</td>
                                    <td>Prevents cross site request forgery</td>
                                    <td>Session</td>
                                </tr>
                                <tr>
                                    <td>session</td>
                                    <td>Provides a unique session identifier for dashboard Users</td>
                                    <td>Persistent</td>
                                </tr>
                                <tr>
                                    <td>machine_identifier</td>
                                    <td>Provides a unique session identifier for authentication</td>
                                    <td>Persistent</td>
                                </tr>
                                <tr>
                                    <td>country</td>
                                    <td>Sets a country code as determined by IP address</td>
                                    <td>Persistent</td>
                                </tr>
                                <tr>
                                    <td>lang</td>
                                    <td>Sets a language code</td>
                                    <td>Persistent</td>
                                </tr>
                                <tr>
                                    <td>cid</td>
                                    <td>Sets a value to track User metrics</td>
                                    <td>Persistent</td>
                                </tr>
                                </tbody>
                            </table>

                            <h4 id="third-party-cookies">Third party cookies<a className="anchor" href="#third-party-cookies">{null}</a></h4>

                            <table className="alternate">
                                <thead>
                                <tr>
                                    <th>Cookie Name</th>
                                    <th>Purpose</th>
                                    <th>Opt out link</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Google</td>
                                    <td>Used for analytics and service improvement</td>
                                    <td><a
                                        href="http://tools.google.com/dlpage/gaoptout">tools.google.com/dlpage/gaoptout</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </section>
                    </article>
                </div>
        )
    }
}

export default withContainer(CookiePolicy);

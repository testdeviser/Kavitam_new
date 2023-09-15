
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function PlayesFeedback(props) {
  // Configure the slider settings
  const sliderSettings = {
    dots: true, // Show navigation dots
    infinite: true, // Enable infinite scrolling
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
  };

  return (
    <div className='testimonial-main define_float'>
      <div className="testi_dots"><img src={process.env.PUBLIC_URL + '/image/testi_dots.png'} alt="testi_dots" /></div>
      <div className="login-right-bttom">
        <img src="/image/login-right-bttom.png" alt="login-right-bttom" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="live_result_sec define_float">
              {/* <h5 className='heading'>Testimonials</h5>
              <img className='white_dot_img' src={process.env.PUBLIC_URL + '/image/white-dot-lines.png'} alt="" width={218} height={18} /> */}
              <h2>Player’s valuable feedback</h2>
            </div>
          </div>
          <div className="col-lg-12">
            <Slider {...sliderSettings}>
              <div className="testi_ct-slide">
                <div className='left-right-sec'>
                  <div className='lft-sectn'>
                    <div className='heading-sectn'>
                      <h3>Rohit</h3>
                    </div>
                    <div className="white_dot_img client_img-ct"><img src={process.env.PUBLIC_URL + '/image/image1.jpg'} alt="" width={172} height={172} /></div>
                  </div>
                  <div className='rgt-sectn'>
                    <img className='' src={process.env.PUBLIC_URL + '/image/Quote.png'} alt="" />
                    <p>
                      मैंने यह गेम तीन बार खेला था. मैंने कुल 100 रुपये का निवेश किया और 9000 रुपये का लाभ प्राप्त किया। यदि आप लाभ कमाना चाहते हैं, तो आपको कम से कम एक बार यह गेम खेलना चाहिए
                    </p>
                    <img className='right-quote' src={process.env.PUBLIC_URL + '/image/Quote1.png'} alt="" />
                  </div>
                </div>
              </div>

              <div className="testi_ct-slide">
                <div className='left-right-sec'>
                  <div className='lft-sectn'>
                    <div className='heading-sectn'>
                      <h3>Ishaan</h3>
                    </div>
                    <div className="white_dot_img client_img-ct"><img src={process.env.PUBLIC_URL + '/image/image2.jpg'} alt="" width={172} height={172} /></div>
                  </div>
                  <div className='rgt-sectn'>
                    <img className='' src={process.env.PUBLIC_URL + '/image/Quote.png'} alt="" />
                    <p>
                      मैंने इस गेम में 200 रुपये लगाए थे और मुझे 18000 रुपये का फायदा हुआ| अगर आप मुनाफा कमाना चाहते हैं तो आपको ये गेम खेलना चाहिए|
                    </p>
                    <img className='right-quote' src={process.env.PUBLIC_URL + '/image/Quote1.png'} alt="" />
                  </div>
                </div>
              </div>

              <div className="testi_ct-slide">
                <div className='left-right-sec'>
                  <div className='lft-sectn'>
                    <div className='heading-sectn'>
                      <h3>Harpreet Singh</h3>
                    </div>
                    <div className="white_dot_img client_img-ct"><img src={process.env.PUBLIC_URL + '/image/imag3.jpg'} alt="" width={172} height={172} /></div>
                  </div>
                  <div className='rgt-sectn'>
                    <img className='' src={process.env.PUBLIC_URL + '/image/Quote.png'} alt="" />
                    <p>
                      मैंने इस गेम में 1000 रुपये का निवेश किया था, मुझे 90000 रुपये का लाभ हुआ। मुझे लगता है कि आपको भी लाभ पाने के लिए इस गेम में निवेश करना चाहिए।
                    </p>
                    <img className='right-quote' src={process.env.PUBLIC_URL + '/image/Quote1.png'} alt="" />
                  </div>
                </div>
              </div>

              <div className="testi_ct-slide">
                <div className='left-right-sec'>
                  <div className='lft-sectn'>
                    <div className='heading-sectn'>
                      <h3>Karan</h3>
                    </div>
                    <div className="white_dot_img client_img-ct"><img src={process.env.PUBLIC_URL + '/image/imag4.jpg'} alt="" width={172} height={172} /></div>
                  </div>
                  <div className='rgt-sectn'>
                    <img className='' src={process.env.PUBLIC_URL + '/image/Quote.png'} alt="" />
                    <p>
                      मैंने यह गेम तीन बार खेला था. मैंने कुल 10 रुपये का निवेश किया और 900 रुपये का लाभ प्राप्त किया। यदि आप लाभ कमाना चाहते हैं, तो आपको कम से कम एक बार यह गेम खेलना चाहिए
                    </p>
                    <img className='right-quote' src={process.env.PUBLIC_URL + '/image/Quote1.png'} alt="" />
                  </div>
                </div>
              </div>

              <div className="testi_ct-slide">
                <div className='left-right-sec'>
                  <div className='lft-sectn'>
                    <div className='heading-sectn'>
                      <h3>Ishani</h3>
                    </div>
                    <div className="white_dot_img client_img-ct"><img src={process.env.PUBLIC_URL + '/image/imag5.jpg'} alt="" width={172} height={172} /></div>
                  </div>
                  <div className='rgt-sectn'>
                    <img className='' src={process.env.PUBLIC_URL + '/image/Quote.png'} alt="" />
                    <p>
                      मैंने इस गेम में 600 रुपये लगाए थे और मुझे 54000 रुपये का फायदा हुआ| अगर आप मुनाफा कमाना चाहते हैं तो आपको ये गेम खेलना चाहिए|
                    </p>
                    <img className='right-quote' src={process.env.PUBLIC_URL + '/image/Quote1.png'} alt="" />
                  </div>
                </div>
              </div>

              <div className="testi_ct-slide">
                <div className='left-right-sec'>
                  <div className='lft-sectn'>
                    <div className='heading-sectn'>
                      <h3>Pooja</h3>
                    </div>
                    <div className="white_dot_img client_img-ct"><img src={process.env.PUBLIC_URL + '/image/imag6.jpg'} alt="" width={172} height={172} /></div>
                  </div>
                  <div className='rgt-sectn'>
                    <img className='' src={process.env.PUBLIC_URL + '/image/Quote.png'} alt="" />
                    <p>
                      मैंने इस गेम में 500 रुपये का निवेश किया था, मुझे 45000 रुपये का लाभ हुआ। मुझे लगता है कि आपको भी लाभ पाने के लिए इस गेम में निवेश करना चाहिए।
                    </p>
                    <img className='right-quote' src={process.env.PUBLIC_URL + '/image/Quote1.png'} alt="" />
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayesFeedback;

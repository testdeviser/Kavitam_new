import React from 'react';

function Picking_A_Number(props) {
   return (
      <section className='Easiest_way_section define_float'>
         <div className="login-right-bttom">
            <img src="/image/login-right-bttom.png" alt="login-right-bttom" />
         </div>
         <div className="container">
            <div className="row ">
               <div className="col-lg-12">
                  <div className="live_result_sec define_float">
                     {/* <h5 className='heading'>How it works</h5> */}
                     <h5 className='heading hindi_text'>लोग कवितम मटका ऑनलाइन क्यों खेलते हैं और कैसे?</h5>
                     <img className='white_dot_img' src={process.env.PUBLIC_URL + '/image/white-dot-lines.png'} alt="" width={218} height={18} />
                     {/* <h2>Easiest way to picking a number</h2> */}
                     <h2 className='hindi_text'>कवितम मटका खेल ऑनलाइन खेलना बहुत आसान है, आपको यहाँ पे रजिस्टर करना है और हर घंटे ऑनलाइन पैसा लगाकर कवितम मटका खेल सकते है और पैसा कमा सकते है, इस वेबसाइट पर हर घंटे लाखो लोग पैसा लगाते है और लाखो रूपए जीतते है।

                        क्या मै कवितम मटका खेलकर जीत सकता हु?

                        कवितम मटका में बहुत लोग रुचि रखते हैं। किसी भी नंबर की एक पर्ची खींच कर किसी को विजेता के रूप में चुना जाता है । विजेता वही होगा जिसके पास कार्ड पर वही नंबर है। अगर आप हमारे टिप्स और ब्लोग्स पढ़ेनेगे तोह आप कवितम मटका के किंग बन जाएंगे ।

                        आखिर ये सट्टा मटका है क्या?

                        प्रारंभ में, यह खेल मुंबई में शुरू किया गया था। अब यह पूरे देश में फैल गया है। भारत में `सट्टा` आमतौर पर` जुआ` शब्द का हिंदी रूपांतरण है। `मटका` (मटका किंग या सट्टा मटका) शब्द एक ऐसे बर्तन को संदर्भित करता है जिसका उपयोग संख्याओं को चुनने के लिए किया जाता है। सट्टा मटका जुआ है। ज्यादातर लोग कवितम मटका गेम को सिर्फ इसलिए खेलते हैं क्योंकि यह गेम सरल गेम है और इससे बहुत पैसा कमाया जा सकता है, क्यों की ये हर घंटे खेला जाने वाल खेल है।

                        नोट:- भारत में सट्टेबाजी अवैध है, हम आपको इस ब्लॉग के माध्यम से सही जानकारी देना चाहते है । सट्टे को प्रोत्साहित करने का हमारा कोई मकसद नहीं है। नीचे दी गई जानकारी केवल ज्ञान के उद्देश्य के लिए है।</h2>
                  </div>
               </div>
            </div>

            <div className="row cards">
               <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="easyWay-card  get-access ">
                     <div className="left"> <div className='Easiest-card-number'>01</div> <div className='Easiest-card-info'>लॉग इन करें</div></div>
                     <div className="right"> <img src={process.env.PUBLIC_URL + '/image/esiestCard-tv.svg'} /></div>
                  </div>
               </div>
               <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="easyWay-card  get-access ">
                     <div className="left"><div className='Easiest-card-number'>02</div><div className='Easiest-card-info'>अपना नंबर चुनें</div></div>
                     <div className="right"><img src={process.env.PUBLIC_URL + '/image/group3.png'} /></div>
                  </div>
               </div>

               <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="easyWay-card  get-access">
                     <div className="left"><div className='Easiest-card-number'>03</div><div className='Easiest-card-info'>विजेता बने</div></div>
                     <div className="right"><img src={process.env.PUBLIC_URL + '/image/win_lottery.svg'} /></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

   );
}

export default Picking_A_Number;
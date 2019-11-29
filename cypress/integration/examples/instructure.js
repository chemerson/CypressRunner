import '@applitools/eyes-cypress/commands'

describe('Cypress Applitools Demo', () => {
  it('Cypress Demo', () => {

            var appName = "";
            var testName = "";
            var batchName = "";
            var matchLevel  = "";

            cy.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                // debugger
                return false
            })

            describe('Hooks', function() {
              before(function() {
                // runs once before all tests in the block
              })
            
              after(function() {
                // runs once after all tests in the block
              })
            
              beforeEach(function() {
                // runs before each test in the block
              })
            
              afterEach(function() {
                // runs after each test in the block
              })
            })
          
            // Cypress.Errors.onUncaughtException(false);
            cy.fixture("config.csv").then((config) => {
              
              var test_config = config.split('\n');
              var current_config;

              for(var i = 1; i < test_config.length; i++){

                  current_config = test_config[i].split(',');

                  if(current_config[0] == "app name")
                    appName = current_config[1];
                  else if(current_config[0] == "test name")
                    testName = current_config[1];
                  else if(current_config[0] == "batch name")
                    batchName = current_config[1];
                  else if(current_config[0] == "match level" && current_config[1] != '')
                    matchLevel = current_config[1].trim();
              }

              if(batchName == "")
                batchName = testName;

                cy.fixture("environments.csv").then((envs) =>
                {
                
                  var my_envs = envs.split('\n');
                
                  var env_array = [];
                  var browser;
                  var width;
                  var height;
                  var deviceName;
                  var orientation;
                  
                   for(var i = 1; i < my_envs.length; i++){
                   
                      var env_config = my_envs[i].split(',');
                      if(env_config[0] != ''){

                        browser = env_config[0];
                        var viewport_size = env_config[1].trim().split('-');
                        width = viewport_size[0];
                        height = viewport_size[1];
                        env_array[i-1] = {width:Number(width), height:Number(height), name:browser};
                        cy.log("Environment #" + i.toString() + ": Desktop " + browser);

                      }
                      else{
                        deviceName = env_config[2].trim();
                        orientation = env_config[3].trim();

                        env_array[i-1] = {deviceName: deviceName, screenOrientation: orientation};
                        cy.log("Environment #" + i.toString() + ": " + deviceName + " ");

                      }                      
                    }

                    cy.fixture("urls.csv").then((urls) => {

                      var my_urls = urls.split('\n');
                      
                      cy.eyesOpen({
                          appName: appName,
                          testName: testName,
                          browser: env_array,
                          batchName: batchName,
                          matchLevel: matchLevel,

                        });

                      for(var url = 1; url < my_urls.length; url++){  
                        
                        if(my_urls[url] != '')
                        {
                          cy.log("******************** URL#" + url.toString() + "********************");
                          cy.visit(my_urls[url], 
                            {
                              onLoad: (contentWindow) => {

                               try {

                                  function nativeSelector() {
                                    var elements = contentWindow.document.querySelectorAll("body, body *");
                                    var results = [];
                                    var child;
                                    for(var i = 0; i < elements.length; i++) {
                                        child = elements[i].childNodes[0];
                                        if(elements[i].hasChildNodes() && child.nodeType == 3) {
                                          results.push(child);
                                        }
                                    }
                                    return results;
                                  }

                                  var textnodes = nativeSelector(), _nv;
                                  var r = 4; Math.floor(Math.random() * 3);
                              
                                  switch(r) {
                                    case 1 :
                                      //contentWindow.document.querySelector("img:nth-child(1)").style.display = 'none';
                                      for (var i = 0, len = textnodes.length; i<len; i++){
                                        _nv = textnodes[i].nodeValue;
                                        textnodes[i].nodeValue = _nv.replace('.',',     .');
                                      }
                                      break;
                                    case 2 : 
                                      for (var i = 0, len = textnodes.length; i<len; i++){
                                        _nv = textnodes[i].nodeValue;
                                        textnodes[i].nodeValue = _nv.replace('o','0');
                                      }
                                      break;
                                  }

                                } catch (err) {

                                }
                              },
                              failOnStatusCode: false
                          });
                        
                          cy.get('[data-qa="login_uid"]', { timeout: 20000 }).type('admin');
                          cy.get('[type="password"]').type('password');

                          cy.eyesCheckWindow({
                            tag: my_urls[url]
                          });
                          
                          cy.get('[data-capybara="login_button"]').click();

                          cy.get('[data-qa="peopleHeader"]', { timeout: 20000 }).eyesCheckWindow({
                            tag: "Home Page",
                            sizeMode: "full-page"
                          });
                          

                          sizeMode: 'viewport'// 'viewport' //'full-page'

                         // cy.eyesCheckWindow({
                         //   tag: my_urls[url],
                         //   sizeMode: 'selector',
                         //   selector: {
                         //     type: 'css',
                         //     selector: '#layout-region-top-content > div > div' // or '//button'
                         //   }
                         // });
               
                        }                       

                      }
                      cy.eyesClose(false);
                });
             });
          });
  });  
});

  
/*
function scrollPage(){
  let pageLen = browser.execute('var body = document.body, \
  html = document.documentElement; \
  return Math.max( body.scrollHeight, body.offsetHeight, \
          html.clientHeight, html.scrollHeight, html.offsetHeight );');
  const sectionLen = 400;
  let sections = pageLen.value/sectionLen; 
  for(let i=1;i<sections;i++){
      browser.scroll(0,sectionLen*i);
      browser.pause(500);
  }
  browser.scroll(0,0);
}
*/
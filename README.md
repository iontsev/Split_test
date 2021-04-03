# Split test

## The simple script for split testing
The “_split-test.js_” script uses the traffic share for split testing (the share specified in the “_portion_” option of the config). The traffic share divides into groups for each segment specified in the “_segment_” option.

Each new user is randomly assigned a group label (the segment name or “...” label for the control group). The label is stored in cookies. Then the “_split-test.js_” script passes the label as the third parameter to the functions specified in the “_display_” and “_message_” options.

The script has the following parameters at startup:

+ __portion__ — the traffic share for split testing.
+ __limiter__ — the cookie storage time (days).
+ __subject__ — the name of the cookie for store the label of the test group.
+ __segment__ — the label list of testing variants.
+ __display__ — the function that implements the testing variants (change current page or redirect to another).
+ __message__ — the collecting statistics function.

### The example configuration for this script
Test two variant page (“/test/page-a” and “/test/page-b”):

    {
        'portion': 1,  // all traffic is used for testing
        'limiter': 30,  // the cookie storage time 30 days
        'subject': 'A/B test home page',  // the name of the cookie for store the label of the test group
        'segment': ['/test/page-a/', '/test/page-b/'],  // the label list of testing variants
        'display': function (segment, subject, variant) {  // the redirect to the test variant (the group label is the address of the page test version)
            var href = '';
            var host = '';
            var path = '';
            var mark = '';
            var data = '';
            var meta = '';

            if (segment.join('').split(variant).length > 1) {
                href = window.location.href;

                if (href.split('//').length > 1) {
                    host = href.split('//', 1)[0] + '//' + href.split('//', 2)[1].split('/', 1)[0];
                    path = href.split(host, 2)[1].split('?', 1)[0].split('#', 1)[0];

                    if (segment.join('').split(path).length > 1 || segment.join('').split(host + path).length > 1) {
                        mark = href.split(path, 2)[1];
                        data = (mark.split('?').length > 1) ? '?' + mark.split('?', 2)[1].split('#', 1)[0] : data;
                        meta = (mark.split('#').length > 1) ? '#' + mark.split('#', 2)[1].split('?', 1)[0] : meta;
                        mark = data + meta;

                        if (href.split(variant).length === 1) window.location.replace(host + variant + mark);

                    };

                };

            };

            return true;  // “true” is signal that the function worked without errors
        },
        'message': function (segment, subject, variant) {  // collecting statistics and sending in the “dataLayer” array
            window.dataLayerOnline = window.dataLayerOnline || [];
            window.dataLayerOnline.push({
                'event': 'split_test_event',
                'split_test_title': subject,
                'split_test_value': variant
            });

            return true;  // “true” is signal that the function worked without errors
        }
    }

A/B test of hyperlink for logotype:

    {
        'portion': 1,  // all traffic is used for testing
        'limiter': 30,  // the cookie storage time 30 days
        'subject': 'A/B test of hyperlink for logotype',  // the name of the cookie for store the label of the test group
        'segment': ['Link', 'None'],  // the label list of testing variants
        'display': function (segment, subject, variant) {  // deactivate hyperlink for logotype for “None” user group

            if (variant === 'None') {

                if (document.querySelectorAll('a.logotype').length > 0) {

                    document
                        .querySelectorAll('a.logotype')
                        .forEach(function (data) {

                            data
                                .setAttribute('style', 'cursor: auto; pointer-events: none;');

                            data
                                .addEventListener('click', function(event) {
                                    event.preventDefault();
                                }, false);

                        });

                } else {
                    return false;
                };

            };

            return true;  // “true” is signal that the function worked without errors
        },
        'message': function (segment, subject, variant) {  // collecting statistics and sending in the “dataLayer” array
            window.dataLayerOnline = window.dataLayerOnline || [];
            window.dataLayerOnline.push({
                'event': 'split_test_event',
                'split_test_title': subject,
                'split_test_value': variant
            });

            return true;  // “true” is signal that the function worked without errors
        }
    }

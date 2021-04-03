/*  Split test  */;
(function (environ, options) {
    'use strict';

    var environ = environ;
    var portion = options.portion;
    var limiter = options.limiter;
    var subject = options.subject;
    var segment = options.segment;
    var message = options.message;
    var display = options.display;
    var variant = '';

    function marking(mark, sign, time, path, host, save) {
        var meta = [document.cookie.trim()];
        var data = decodeURIComponent(document.cookie);
        var temp = [];
        var date = new Date();

        if (mark) {
            mark = mark.trim();
            mark = encodeURIComponent(mark);
            meta = meta[0].split(mark + '=', 2);

            if (meta[1]) {
                meta = meta[1].split(';', 1);
                data = decodeURIComponent(meta[0]);
            } else {
                data = '';
            };

        };

        if (sign) {
            sign = sign.trim();
            sign = encodeURIComponent(sign);
            temp.push(mark + '=' + sign);

            if (time) {
                time = date.getTime() + (time * 24 * 60 * 60 * 1000);
                date.setTime(time);
                temp.push('expires=' + date.toGMTString());
            };

            if (path) temp.push('path=' + path);
            if (host) temp.push('domain=' + host);
            if (save) temp.push('secure');

            document.cookie = temp.join('; ') + ';';
            data = decodeURIComponent(mark);
        };

        return data;
    };

    function waiting(work, time, step) {
        var result = false;

        try {

            if (work() === true) {
                result = true;
            } else {
                step = (step > 0) ? step : 0;

                if (step > 1) setTimeout(function () {waiting(work, time, step - 1)}, time);

            };

        } catch (error) {
            result = false;
        };

        return result;
    };

    (function (environ) {
        var window = environ;
        var document = window.document;
        var navigator = window.navigator;

        waiting(
            function () {
                var result = false;

                if (navigator.cookieEnabled === true) {
                    variant = marking(subject);

                    if (variant === '') {

                        if (Math.random() > portion) {
                            variant = '...';
                        } else {
                            variant = segment[Math.floor(Math.random() * segment.length)];
                        };

                        marking(subject, variant, limiter, '/');
                        marking(subject + '--temp', variant, undefined, '/');
                    };

                    if (display(segment, subject, variant) === true) {

                        if (message(segment, subject, variant) === true) result = true;

                    };

                };

                return result;
            },
            11,
            111
        );
    })(environ);
})(
    window,
    {
        'portion': 1,
        'limiter': 30,
        'subject': 'A/B test',
        'segment': ['Variant 1', 'Variant 2', 'Variant 3'],
        'display': function (segment, subject, variant) {
            var result = true;

            console.log('!!!' + subject + ': ' + variant + '!!!');

            return result;
        },
        'message': function (segment, subject, variant) {
            var result = true;
    
            window.dataLayerOnline = window.dataLayerOnline || [];
            window.dataLayerOnline.push({
                'event': 'split_test_event',
                'split_test_title': subject,
                'split_test_value': variant
            });

            return result;
        }
    }
);

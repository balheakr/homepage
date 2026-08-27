/**
 * @file        viewimageresize.js
 * @brief       게시글 본문 이미지 자동 리사이즈
 * @author      LEEHYEONHO (owen0414@neobh.kr)
 * @date        2026-08-27
 *
 * Copyright (c) 2026 NeoBH. All rights reserved.
 *
 * WARNING: This corporate source code is the intellectual property of NeoBH.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium is strictly prohibited. Proprietary and confidential.
 */

(function($) {
    $.fn.viewimageresize = function(selector)
    {
        var cfg = {
                selector: "img"
            };

        if(typeof selector == "object") {
            cfg = $.extend(cfg, selector);
        } else {
            if(selector) {
                cfg = $.extend({ selector: selector });
            }
        }

        var $img = this.find(cfg.selector);
        var $this = this;

        $img.removeAttr("height")
            .css("height", "");

        function image_resize()
        {
            var width = $this.width();

            $img.each(function() {
                if($(this).data("width") == undefined)
                    $(this).data("width", $(this).width());

                if($(this).data("width") > width) {
                    $(this).removeAttr("width")
                           .removeAttr("height")
                           .css("width","")
                           .css("height", "");

                    if($(this).data("width") > width) {
                        $(this).css("width", "100%");
                    }
                } else {
                    $(this).attr("width", $(this).data("width"));
                }
            });
        }

        $(window).on("load", function() {
            image_resize();
        });

        $(window).on("resize", function() {
            image_resize();
        });
    }

    $.fn.viewimageresize2 = function(selector)
    {
        var cfg = {
                selector: "img"
            };

        if(typeof selector == "object") {
            cfg = $.extend(cfg, selector);
        } else {
            if(selector) {
                cfg = $.extend({ selector: selector });
            }
        }

        var $img = this.find(cfg.selector);
        var $this = this;

        function image_resize()
        {
            var width = $this.width();

            $img.each(function() {
                $(this).removeAttr("width")
                       .removeAttr("height")
                       .css("width","")
                       .css("height", "");

                if($(this).data("width") == undefined)
                    $(this).data("width", $(this).width());

                if($(this).data("width") > width) {
                    $(this).css("width", "100%");
                }
            });
        }

        $(window).on("resize", function() {
            image_resize();
        });

        image_resize();
    }
}(jQuery));
avatarImg.$inject = ['$http'];

function avatarImg($http) {
	return {
		restrict: 'AE',
		template: require('html-loader!./html/avatar.tpl.htm').default,
		link: function(scope, elem, attr) {

			$http.get('../avatar-image/')
			.then(
				function(response){
          console.log()
					if(response.data == '' || response.data == undefined) {
            scope.defaultAvatar = '../media/avatar-default.png';
						scope.avatarImg = null;
					}
					else {
						scope.avatarImg = '../avatar-image/';
					}
				}
			)

		}
	}
}

function selectAvatar() {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            element.bind('change', function(event) { //2/3

                scope.uploadImg = false;
                scope.imgSelected = true;

                var input = this;

                if(input.files && input.files[0]) { //source: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        scope.$apply(function () {
                            scope.cropped.source = e.target.result; //2/3
                        });

                    }

                    reader.readAsDataURL(input.files[0]);

                }

            });
        }
    };

};

function ppTooltip() {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var id = attrs['ppTooltip'].match(/#?(.+)/)[1];
            if (!id) throw "bad id";
            
            var $tooltip = angular.element(document.getElementById(id));
            if (!$tooltip[0]) throw "tooltip '"+id+"' not found";
            
            // the root html element. For window dimensions
            var html = document.getElementsByTagName('html')[0];
            
            // get the tooltip border width
            var getBorderWidth = function() {
                // IE lte 8 case
                if (!window.getComputedStyle) return 1; // EAT THIS AND LIKE IT, IE.
                
                var s = getComputedStyle($tooltip[0]);
                
                // if the border is none, the border-width is 0
                if (s.getPropertyValue('border') == 'none') {
                    return 0;
                }
                else {
                    return parseInt(s.getPropertyValue('border-width'), 10);
                }
                
            };
            
            // spacing values
            // margin so that the tooltip is not touching any edges
            var margin = 1;
            // tooltip border width
            var bdw = getBorderWidth();
            // the size of the caret
            var caretSize = 5;
            // caret overlap on the target
            var caretOvr = 0;
            if (caretOvr>0) caretOvr = caretOvr + margin + bdw;
            // the left offset from the caret midpoint, if the tooltip is wide enough
            var leftOffset = -30;
            
            $tooltip.show = function() {
                this.css('display', 'inline-block');
            };
            $tooltip.hide = function() {
                this.css('display', 'none');
            };
            $tooltip.hide();
            // position the tooltip and make it visible
            $tooltip.positionAndShow = function() {
                
                // reset tooltip styles
                $tooltip.css({
                   'position': 'fixed',
                   'z-index': '9999999',
                   'box-sizing': 'border-box',
                   'width': 'auto'
                });
                
                // show the tooltip now. Must be visible to get dimensions.
                $tooltip.show();
                
                // get tooltip element's metrics
                var tt = getMetrics($tooltip[0]);
                // get the target element's metrics
                var tgt = angular.copy(element[0].getBoundingClientRect());
                if (!tgt.width) {
                    tgt.width = tgt.right - tgt.left;
                    tgt.height = tgt.top - tgt.bottom;
                }
                tgt.mid_x = tgt.right - (tgt.width/2);
                tgt.mid_y = tgt.bottom - (tgt.height/2);
                
                // the window's screen dimensions
                var screen = {
                    width: html.clientWidth,
                    height: html.clientHeight
                };
                
                // if the target element is wider than the leftOffset,
                if (leftOffset < tgt.width/2) {
                    // make leftOffset bigger
                    leftOffset = -tgt.width/2
                }
                
                // if the tooltip width is too small for the leftOffset
                if (tt.width/2 < -leftOffset) {
                    // reduce leftOffset
                    leftOffset = -tt.width/2;
                }
                
                // Position left
                
                // if the tooltip is too wide for the screen
                if (margin + tt.width + margin > screen.width) {
                    // make the tooltip full-width
                    tt.left = 0 + margin;
                    tt.width = screen.width - margin - margin;
                }
                // if the tooltip is less wide than the screen
                else {
                    // if there isn't enough space to the right
                    if (tgt.mid_x + leftOffset + tt.width + margin > screen.width) {
                        tt.left = screen.width - margin - tt.width;
                    }
                    // if there isn't enough space to the left
                    else if (tgt.mid_x + leftOffset < 0 + margin) {
                        // place tooltip at left edge
                        tt.left = 0 + margin;
                        //tt.width = 'auto';
                    }
                    // if there are no overflow problems
                    else {
                        // place tooltip at middle of target, offset
                        tt.left = tgt.mid_x + leftOffset;
                        //tt.width = 'auto';
                    }
                    
                }
                $tooltip.css({
                    'left': tt.left + 'px',
                    'width': tt.width + 'px'
                })
                // recompute the metrics for the tooltip, since we may have changed its width
                tt = getMetrics($tooltip[0]);
                
                // Position top
                
                // if there's space above
                if (tgt.top > margin + tt.height + caretSize + margin) {
                    // put it above
                    tt.top = tgt.top /* - margin*/ - caretSize - tt.height + caretOvr;
                    $tooltip.css('top', tt.top + 'px');
                    // caret arrow goes below
                    $tooltip.removeClass('arr-above');
                    $tooltip.addClass('arr-below');
                }
                else {
                    // put it below. If there's not enough space there either, then too bad
                    tt.top = tgt.top + tgt.height /* + margin*/ + caretSize - caretOvr;
                    $tooltip.css('top', tt.top + 'px');
                    // caret arrow goes below
                    $tooltip.addClass('arr-above');
                    $tooltip.removeClass('arr-below');
                }
                
                // position the caret at the middle of the target
                setupCaret(tt, -tt.left + tgt.mid_x);
                
            };
            
            element.on('mouseover click', function(){
                //scope.$apply(function(){ // not really necessary yet
                    $tooltip.positionAndShow();
                //});
            })
            element.on('mouseout blur', function(){
                //scope.$apply(function(){ // not really necessary yet
                    $tooltip.hide();
                //});
            });
            
            var getMetrics = function(el) {
                var area = getOffset(el);
                return area;
            };
            
            // caret (can't be css. must be linked to JS for positioning)
            var $caret, $caretborder;
            $tooltip.append($caret).append($caretborder);
            
            // Set the caret styles to match the computedStyle colors from the tooltip
            // @param xpos the position of the caret midpoint, relative to the tooltip
            var setupCaret = function (tt, xpos) {
                if (!window.getComputedStyle) return; // NO CARET FOR YOU, IE lte 8!
                
                // create or grab the carets
                if ($tooltip.find('mark').length == 2) {
                    $caret = $tooltip.find('mark').eq(0);
                    $caretborder = $tooltip.find('mark').eq(1);
                }
                else {
                    $caret = angular.element('<mark class="caret">');
                    $caretborder = angular.element('<mark class="caret-border">');
                }
                
                $tooltip.append($caret).append($caretborder);
                
                // min corner. If the caret is by the corner, enforce this min distance
                var mc = 3;
                
                // make the caret fit on the right side
                if (xpos + caretSize + bdw > tt.width) xpos = tt.width - bdw - caretSize - mc - 1; // -1 for pixel sync
                // make the caret fit on the left side
                if (xpos < caretSize) xpos = caretSize + mc;
                
                var generalStyles = {
                    'display': 'block',
                    'width': 0,
                    'height': 0,
                    'position': 'absolute',
                    'top': 'auto',
                    'left': xpos - caretSize + 'px',
                    'border': caretSize + 'px solid transparent',
                    'background': 'transparent',
                    'z-index': 2
                };
                $caret.css(generalStyles);
                $caretborder.css(generalStyles);
                
                if (bdw == 0) {
                    $caretborder.css('display','none');
                }
                
                var ttstyles = getComputedStyle($tooltip[0]);
                var bgcolor = ttstyles.getPropertyValue('background-color');
                var bordercolor = ttstyles.getPropertyValue('border-color');
                
                // set top absolute position
                if ($tooltip.hasClass('arr-above')) {
                    $caret.css({
                        'top': 0 - caretSize + 'px',
                        'bottom': 'auto',
                        'border-top': 'none',
                        'border-bottom': caretSize + 'px solid ' + bgcolor,
                        'z-index': 3
                    });
                    $caretborder.css({
                        'top': 0 - caretSize - bdw + 'px', // overlap the tooltip border
                        'bottom': 'auto',
                        'border-top': 'none',
                        'border-bottom': caretSize + 'px solid ' + bordercolor
                    });
                }
                else {
                    $caret.css({
                        'top': 'auto',
                        'bottom': 0 - caretSize + 'px',
                        'border-top': caretSize + 'px solid ' + bgcolor,
                        'border-bottom': 'none',
                        'z-index': 3
                    });
                    $caretborder.css({
                        'top': 'auto',
                        'bottom': 0 - caretSize - bdw + 'px', // overlap the tooltip border
                        'border-top': caretSize + 'px solid ' + bordercolor,
                        'border-bottom': 'none'
                    });
                }
            };
            
            var getOffset = function(el) {
                var x = el.offsetLeft, 
                    y = el.offsetTop,
                    w = el.offsetWidth,
                    h = el.offsetHeight;
                while (el = el.offsetParent) {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                }
                return {
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                    mid_x: x + (w/2),
                    mid_y: y + (h/2)
                }
            };
            
        }
    };

};

export default angular.module('directives.select-avatar', [])
    .directive('selectAvatar', selectAvatar)
    .directive('avatarImg', avatarImg)    
    .directive('ppTooltip', ppTooltip)    
    .name;
(function ($) {
  $(document).ready(function () {

    // Supercharge Enhanced Slider
    var superchargeSlider = new Swiper('#supercharged-image-slider', {
      // Optional parameters
      direction: 'horizontal',
      effect: 'slide',
      speed: 100,
      slidesPerView: 1,

      // Touch
      allowTouchMove: false,
      shortSwipes: false,
      touchRatio: 0.85,
      longSwipesRatio: 0.35,
      longSwipesMs: 200,
      threshold: 20,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination.supercharge-pagination',
        type: 'custom',
        renderCustom: function (swiper, current, total) {
          let htmlPagination = '';
          $('.swiper-container.supercharge .supercharge-slides').each(function (index) {
            htmlPagination += `
              <div class="pagination-point ${current - 1 === index ? 'active' : ''}" data-index="${index}">
                <span>0${index + 1}</span>
                <div class="pagination-bar-btm"></div>
              </div>
            `;
          })
          return `<div class="pagination-holder">${htmlPagination}</div>`;
        },
        clickable: true,
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar.supercharge-scrollbar',
      },
    });

    // In a Product Development Meeting
    const product_meeting = {
      title: [
        "Experiment Ideas with Uncertainty",
        "Iterate Product Features Slowly",
        "Build Data Assets Manually",
      ],
      description: [
        "Experiments are assessed with limitation and based on high level metrics such as revenue or customers.",
        "Iteration cycle could take weeks due to manually measuring and analysing results.",
        "Rely on human expertise and manual processes to collect, store, extract and analyse data.",
      ],
      supercharged_title: [
        "Experiment Ideas with Confidence",
        "Iterate Product Features with Speed",
        "Build Data Assets Automatically",
      ],
      supercharged_description: [
        "If someone has an idea, they can find the detailed data to back the idea or experiment.",
        "Live data and automated metric measurement with notifications cuts down the iteration process to days.",
        "Optimised data pipeline ensures collection, processing and analysis of data is semi or fully automated.",
      ],
    };

    // In the C-Level meeting Room
    const c_level_meeting = {
      title: [
        "Slow & Tedious Reports",
        "Best Guess Planning & Strategy",
        "Ineffective Business Meetings",
      ],
      description: [
        "Manual reports with data analysis that takes days or weeks to prepare with possible errors.",
        "Without the right data and analytics solution, strategies based on best guess approaches.",
        "Business meetings are based on opinions with different perspectives and expectations.",
      ],
      supercharged_title: [
        "Self-service & Automated Reports",
        "Data Driven Planning & Strategy",
        "Productive Business Meetings",
      ],
      supercharged_description: [
        "Reporting via B.I. dashboards allows for insights and data to be accessed anytime and anywhere.",
        "Data driven analysis and decision making allows effective planning and strategization.",
        "With data as the common language, the team is on the same page with the same set of data and results.",
      ],
    };

    // In a Sales and Marketing Meeting
    const sales_marketing_meeting = {
      title: [
        "Intuition Based Marketing Decisions",
        "Detection of Anomalies Delayed",
        "Lack of Effective Communication",
      ],
      description: [
        "Tweaking ad copy, optimising budgets and other marketing decisions made based on instinct and without any data insight.",
        "Unexpected drops in sales are only detected on weekly or monthly reports and unable to fix problems in time.",
        "Communication is done only when necessary due to limited ideas and possibilities without data.",
      ],
      supercharged_title: [
        "Data Driven Marketing Decisions",
        "Identify & Fix Anomalies Quickly",
        "Enhanced Communication with Data",
      ],
      supercharged_description: [
        "Ad spend, creative direction and budget allocation decisions are made from insights derived from marketing performance data.",
        "Get notifications on sudden decreases in sales and conversion rates immediately and find out the cause before identifying a solution.",
        "Encourages team communication based on availability of data for new ideas on campaign improvements.",
      ],
    };

    let c_level_sub = `
      <div data-sub-selector="c-level-sub" data-index="0" class="sub-selection-icon active"></div>
      <div data-sub-selector="c-level-sub" data-index="1" class="sub-selection-icon"></div>
      <div data-sub-selector="c-level-sub" data-index="2" class="sub-selection-icon"></div>
    `;

    let prod_sub = `
      <div data-sub-selector="prod-sub" data-index="0" class="sub-selection-icon active"></div>
      <div data-sub-selector="prod-sub" data-index="1" class="sub-selection-icon"></div>
      <div data-sub-selector="prod-sub" data-index="2" class="sub-selection-icon"></div>
    `;

    let sales_sub = `
      <div data-sub-selector="sales-sub" data-index="0" class="sub-selection-icon active"></div>
      <div data-sub-selector="sales-sub" data-index="1" class="sub-selection-icon"></div>
      <div data-sub-selector="sales-sub" data-index="2" class="sub-selection-icon"></div>
    `;

    let mainSelectedIndex = 0;
    let selector, subSelector, subElementIndex;

    let superchargedClass = 'is-supercharged';

    // Set Elements
    let supercharge_main = $('#supercharged_enhanced');
    let supercharge_button = $('#supercharge_button');

    let clevel_management_select = $('[data-selection="c-level-and-management"]');
    let product_development_select = $('[data-selection="product-development"]');
    let sales_marketing_select = $('[data-selection="sales-and-marketing"]');

    let supercharge_sub_holder = $('#supercharge_sub_holder');

    // Background Image
    let clevel_img = $('.image-slider-content.c-level-and-management');
    let product_img = $('.image-slider-content.product-development');
    let sales_img = $('.image-slider-content.sales-and-marketing');

    let supercharge_term_title = $('.supercharge-term-title');
    let supercharge_term_description = $('.supercharge-term-description');

    let supercharge_arrow_left = $('#se_nav_arrow_left');
    let supercharge_arrow_right = $('#se_nav_arrow_right');

    // Set Default
    clevel_management_select.addClass('active');
    supercharge_sub_holder.html(c_level_sub);

    // Event Functions
    function moveGraphic(currEle, newView) {
      gsap.to(currEle, 0.5, {
        attr: { viewBox: newView },
        ease: "sine.out",
      });
    }

    function moveTransform(currEle, newView) {
      gsap.to(currEle, 0.5, {
        x: newView.x,
        y: newView.y,
        scaleX: newView.scaleX,
        scaleY: newView.scaleY,
        ease: "sine.out",
      });
    }

    function resetPos() {
      moveTransform(clevel_img, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
      moveTransform(product_img, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
      moveTransform(sales_img, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
    }

    function setText(titleEle, descEle, contentObj, index) {
      titleEle.text(contentObj.title[index]);
      descEle.text(contentObj.description[index]);
    }
    function setSuperchargedText(titleEle, descEle, contentObj, index) {
      titleEle.text(contentObj.supercharged_title[index]);
      descEle.text(contentObj.supercharged_description[index]);
    }

    function setSelectedItem(element, index) {
      mainSelectedIndex = index;
      superchargeSlider.slideTo(index, 500);
      $(".supercharge-selection").not(element).removeClass('active');
      $(element).addClass('active');
    }

    function setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex) {
      if ($(supercharge_main).hasClass(superchargedClass)) {
        if (!selector) {
          setSuperchargedText(supercharge_term_title, supercharge_term_description, c_level_meeting, subElementIndex);
        } else {
          setSuperchargedText(supercharge_term_title, supercharge_term_description, selectedData, subElementIndex);
        }
      } else {
        if (!selector) {
          setText(supercharge_term_title, supercharge_term_description, c_level_meeting, subElementIndex);
        } else {
          setText(supercharge_term_title, supercharge_term_description, selectedData, subElementIndex);
        }
      }
    }

    function onNavClick(mainIndex) {
      // if(!selector) {
      //   setSelectedItem(cle, mainIndex);
      //   supercharge_sub_holder.html(c_level_sub);
      //   setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
      // }
      if (mainIndex === 0) {
        setSelectedItem(clevel_management_select, mainIndex);
        supercharge_sub_holder.html(c_level_sub);
        setSuperchargedMutation(selector, subSelector, c_level_meeting, 0);
      }
      if (mainIndex === 1) {
        setSelectedItem(product_development_select, mainIndex);
        supercharge_sub_holder.html(prod_sub);
        setSuperchargedMutation(selector, subSelector, product_meeting, 0);
      }
      if (mainIndex === 2) {
        setSelectedItem(sales_marketing_select, mainIndex);
        supercharge_sub_holder.html(sales_sub);
        setSuperchargedMutation(selector, subSelector, sales_marketing_meeting, 0);
      }
    }

    // Click Events
    supercharge_arrow_left.on('click', function() {
      resetPos();
      if(mainSelectedIndex == 0) {
        superchargeSlider.slideTo(2 ,500);
        mainSelectedIndex = 2;
        onNavClick(mainSelectedIndex);
      } else {
        superchargeSlider.slideTo(mainSelectedIndex - 1 ,500);
        mainSelectedIndex = mainSelectedIndex - 1;
        onNavClick(mainSelectedIndex);
      }
    });
    supercharge_arrow_right.on('click', function() {
      resetPos();
      if(mainSelectedIndex == 2) {
        superchargeSlider.slideTo(0 ,500);
        mainSelectedIndex = 0;
        onNavClick(mainSelectedIndex);
      } else {
        superchargeSlider.slideTo(mainSelectedIndex + 1 ,500);
        mainSelectedIndex = mainSelectedIndex + 1;
        onNavClick(mainSelectedIndex);
      }
    });
    supercharge_button.on('click', function () {
      if ($(supercharge_main).hasClass(superchargedClass)) {
        supercharge_main.removeClass(superchargedClass);
        $(this).find('.supercharge-text').text('Supercharge your business');
        $(this).removeClass(superchargedClass);
        $('.supercharged_content_right').removeClass(superchargedClass);
        $('#supercharged-image-slider .image-slider-content').removeClass(superchargedClass);
        if (!selector) {
          setText(supercharge_term_title, supercharge_term_description, c_level_meeting, 0);
        }
        if (subSelector === 'c-level-sub') {
          setText(supercharge_term_title, supercharge_term_description, c_level_meeting, subElementIndex);
        }
        if (subSelector === 'prod-sub') {
          setText(supercharge_term_title, supercharge_term_description, product_meeting, subElementIndex);
        }
        if (subSelector === 'sales-sub') {
          setText(supercharge_term_title, supercharge_term_description, sales_marketing_meeting, subElementIndex);
        }
      } else {
        supercharge_main.addClass(superchargedClass);
        $(this).find('.supercharge-text').text('Turn off supercharge');
        $(this).addClass(superchargedClass);
        $('.supercharged_content_right').addClass(superchargedClass);
        $('#supercharged-image-slider .image-slider-content').addClass(superchargedClass);
        if (!subElementIndex) {
          if (!selector) {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, c_level_meeting, 0);
          }
          if (selector === 'clevel') {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, c_level_meeting, 0);
          }
          if (selector === 'product') {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, product_meeting, 0);
          }
          if (selector === 'sales') {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, sales_marketing_meeting, 0);
          }
        } else {
          if (subSelector === 'c-level-sub') {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, c_level_meeting, subElementIndex);
          }
          if (subSelector === 'prod-sub') {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, product_meeting, subElementIndex);
          }
          if (subSelector === 'sales-sub') {
            setSuperchargedText(supercharge_term_title, supercharge_term_description, sales_marketing_meeting, subElementIndex);
          }
        }
      }
    });

    supercharge_sub_holder.on('click', '.sub-selection-icon', function () {
      $('.sub-selection-icon').not(this).removeClass('active');
      $(this).addClass('active');
      subSelector = $(this).data('sub-selector');
      subElementIndex = $(this).data('index');
      if (subSelector === 'c-level-sub') {
        let selectedData = c_level_meeting;
        let clevel_viewArr = [
          { x: 135, y: 325, scaleX: 1.85, scaleY: 1.85 },
          { x: -225, y: 50, scaleX: 1.85, scaleY: 1.85 },
          { x: 145, y: -250, scaleX: 1.85, scaleY: 1.85 }
        ];
        moveTransform(clevel_img, clevel_viewArr[subElementIndex]);
        setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
      }
      if (subSelector === 'prod-sub') {
        let selectedData = product_meeting;
        let prod_viewArr = [
          { x: -25, y: 325, scaleX: 2, scaleY: 2 },
          { x: -25, y: -35, scaleX: 2, scaleY: 2 },
          { x: -25, y: -325, scaleX: 2, scaleY: 2 }
        ];
        moveTransform(product_img, prod_viewArr[subElementIndex]);
        setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
      }
      if (subSelector === 'sales-sub') {
        let selectedData = sales_marketing_meeting;
        let sales_viewArr = [
          { x: 0, y: 225, scaleX: 1.85, scaleY: 1.85 },
          { x: -390, y: -105, scaleX: 1.85, scaleY: 1.85 },
          { x: 390, y: -100, scaleX: 1.85, scaleY: 1.85 }
        ];
        moveTransform(sales_img, sales_viewArr[subElementIndex]);
        setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
      }
    })
    clevel_management_select.on('click', function () {
      resetPos();
      let selectedData = c_level_meeting;
      selector = 'clevel';
      subElementIndex = 0;
      let index = 0;
      setSelectedItem(this, index);
      supercharge_sub_holder.html(c_level_sub);
      setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
    });
    product_development_select.on('click', function () {
      resetPos();
      let selectedData = product_meeting;
      selector = 'product';
      subElementIndex = 0;
      let index = 1;
      setSelectedItem(this, index);
      supercharge_sub_holder.html(prod_sub);
      setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
    });
    sales_marketing_select.on('click', function () {
      resetPos();
      let selectedData = sales_marketing_meeting;
      selector = 'sales';
      subElementIndex = 0;
      let index = 2;
      setSelectedItem(this, index);
      supercharge_sub_holder.html(sales_sub);
      setSuperchargedMutation(selector, subSelector, selectedData, subElementIndex);
    });

    // Set Events
    setText(supercharge_term_title, supercharge_term_description, c_level_meeting, 0);

  });

})(jQuery);
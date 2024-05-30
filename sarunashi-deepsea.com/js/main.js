document.addEventListener('DOMContentLoaded', function() {
    const loadingAnimation = document.getElementById('loading-animation');
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    if(loadingAnimation) {
        if (!lastVisit || now - lastVisit > oneHour) {
            // 最後の訪問から1時間以上経過している場合、ローディングアニメーションを表示
            document.body.classList.add('loading');
            loadingAnimation.style.display = 'flex';

            // ローディングアニメーションを3秒後に消す
            setTimeout(function() {
                loadingAnimation.style.opacity = '0';
                setTimeout(function() {
                    loadingAnimation.style.display = 'none';
                    document.body.classList.remove('loading');
                }, 400); // フェードアウトの時間
            }, 2500); // アニメーションの表示時間

            // 現在の時間を保存
            localStorage.setItem('lastVisit', now);
        } else {
            // すぐにコンテンツを表示
            loadingAnimation.style.display = 'none';
        }
    }


    // map関連
    const svgMap = document.getElementById('map-container');

    // SVGマップの読み込み確認
    if (!svgMap) {
        return;  // SVGマップがない場合、以降のコードを実行しない
    }

    const areas = svgMap.querySelectorAll('path');
    if (areas.length === 0) {
        return;  // パスが見つからない場合、以降のコードを実行しない
    }

    areas.forEach(function(area) {
        area.addEventListener('click', function() {
            // 既存の選択状態を解除
            areas.forEach(function(a) {
                a.classList.remove('selected');
            });
            // クリックされたエリアを選択状態にする
            area.classList.add('selected');
            const description = area.getAttribute('data-description');
            document.getElementById('map-info-description').textContent = description
            if(description){
                document.getElementById('map-info-description').innerHTML = description.replace(/\n/g, '<br>');
            }
            document.getElementById('map-info-title').textContent = area.getAttribute('data-title');
        });
    });
});



//===============================================================
// debounce関数
//===============================================================
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


//===============================================================
// メニュー関連
//===============================================================

// 変数でセレクタを管理
var $menubar = $('#menubar');
var $menubarHdr = $('#menubar_hdr');

// menu
$(window).on("load resize", debounce(function() {
    if(window.innerWidth < 900) {
        // 小さな端末用の処理
        $('body').addClass('small-screen').removeClass('large-screen');
        $menubar.addClass('display-none').removeClass('display-block');
        $menubarHdr.removeClass('display-none ham').addClass('display-block');
    } else {
        // 大きな端末用の処理
        $('body').addClass('large-screen').removeClass('small-screen');
        $menubar.addClass('display-block').removeClass('display-none');
        $menubarHdr.removeClass('display-block').addClass('display-none');

        // ドロップダウンメニューが開いていれば、それを閉じる
        $('.ddmenu_parent > ul').hide();
    }
}, 10));

$(function() {

    // ハンバーガーメニューをクリックした際の処理
    $menubarHdr.click(function() {
        $(this).toggleClass('ham');
        if ($(this).hasClass('ham')) {
            $menubar.addClass('display-block');
        } else {
            $menubar.removeClass('display-block');
        }
    });

    // アンカーリンクの場合にメニューを閉じる処理
    $menubar.find('a[href*="#"]').click(function() {
        $menubar.removeClass('display-block');
        $menubarHdr.removeClass('ham');
    });

    // ドロップダウンの親liタグ（空のリンクを持つaタグのデフォルト動作を防止）
	$menubar.find('a[href=""]').click(function() {
		return false;
	});

	// ドロップダウンメニューの処理
    $menubar.find('li:has(ul)').addClass('ddmenu_parent');
    $('.ddmenu_parent > a').addClass('ddmenu');

// タッチ開始位置を格納する変数
var touchStartY = 0;

// タッチデバイス用
$('.ddmenu').on('touchstart', function(e) {
    // タッチ開始位置を記録
    touchStartY = e.originalEvent.touches[0].clientY;
}).on('touchend', function(e) {
    // タッチ終了時の位置を取得
    var touchEndY = e.originalEvent.changedTouches[0].clientY;

    // タッチ開始位置とタッチ終了位置の差分を計算
    var touchDifference = touchStartY - touchEndY;

    // スクロール動作でない（差分が小さい）場合にのみドロップダウンを制御
    if (Math.abs(touchDifference) < 10) { // 10px以下の移動ならタップとみなす
        var $nextUl = $(this).next('ul');
        if ($nextUl.is(':visible')) {
            $nextUl.stop().hide();
        } else {
            $nextUl.stop().show();
        }
        $('.ddmenu').not(this).next('ul').hide();
        return false; // ドロップダウンのリンクがフォローされるのを防ぐ
    }
});

    //PC用
    $('.ddmenu_parent').hover(function() {
        $(this).children('ul').stop().show();
    }, function() {
        $(this).children('ul').stop().hide();
    });

    // ドロップダウンをページ内リンクで使った場合に、ドロップダウンを閉じる
    $('.ddmenu_parent ul a').click(function() {
        $('.ddmenu_parent > ul').hide();
    });

});


//===============================================================
// 小さなメニューが開いている際のみ、body要素のスクロールを禁止
//===============================================================
$(document).ready(function() {
  function toggleBodyScroll() {
    // 条件をチェック
    if ($('#menubar_hdr').hasClass('ham') && !$('#menubar_hdr').hasClass('display-none')) {
      // #menubar_hdr が 'ham' クラスを持ち、かつ 'display-none' クラスを持たない場合、スクロールを禁止
      $('body').css({
        overflow: 'hidden',
        height: '100%'
      });
    } else {
      // その他の場合、スクロールを再び可能に
      $('body').css({
        overflow: '',
        height: ''
      });
    }
  }

  // 初期ロード時にチェックを実行
  toggleBodyScroll();

  // クラスが動的に変更されることを想定して、MutationObserverを使用
  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(document.getElementById('menubar_hdr'), { attributes: true, attributeFilter: ['class'] });
});


//===============================================================
// スムーススクロール
//===============================================================
$(function() {
    // ページ上部へ戻るボタンのセレクター
    var topButton = $('.pagetop');
    // ページトップボタン表示用のクラス名
    var scrollShow = 'pagetop-show';

    // スムーススクロールを実行する関数
    // targetにはスクロール先の要素のセレクターまたは'#'（ページトップ）を指定
    function smoothScroll(target) {
        // スクロール先の位置を計算（ページトップの場合は0、それ以外は要素の位置）
        var scrollTo = target === '#' ? 0 : $(target).offset().top - 25;
        // アニメーションでスムーススクロールを実行
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

    // ページ内リンクとページトップへ戻るボタンにクリックイベントを設定
    $('a[href^="#"], .pagetop').click(function(e) {
        e.preventDefault(); // デフォルトのアンカー動作をキャンセル
        var id = $(this).attr('href') || '#'; // クリックされた要素のhref属性を取得、なければ'#'
        smoothScroll(id); // スムーススクロールを実行
    });

    // スクロールに応じてページトップボタンの表示/非表示を切り替え
    $(topButton).hide(); // 初期状態ではボタンを隠す
    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) { // スクロール位置が300pxを超えたら
            $(topButton).fadeIn().addClass(scrollShow); // ボタンを表示
        } else {
            $(topButton).fadeOut().removeClass(scrollShow); // それ以外では非表示
        }
    });

    // ページロード時にURLのハッシュが存在する場合の処理
    if(window.location.hash) {
        // ページの最上部に即時スクロールする
        $('html, body').scrollTop(0);
        // 少し遅延させてからスムーススクロールを実行
        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 10);
    }
});


//===============================================================
// 汎用開閉処理
//===============================================================
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).next().slideToggle();
		$('.openclose').not(this).next().slideUp();
	});
});
$(function() {
	$('.openclose-parts').next().hide();
	$('.openclose-parts').click(function() {
		$(this).next().slideToggle();
		$('.openclose-parts').not(this).next().slideUp();
	});
});



//===============================================================
// 背景切り替え
//===============================================================
$(document).ready(function () {
  function checkVisibility() {
    const viewportHeight = $(window).height(); // ビューポートの高さ
    const scrollTop = $(window).scrollTop(); // 現在のスクロール位置

    $(".section").each(function () {
      const sectionTop = $(this).offset().top; // セクションの上端位置
      const sectionHeight = $(this).outerHeight(); // セクションの高さ

      // セクションの位置をチェックして画像を切り替える
      if (sectionTop < scrollTop + viewportHeight * 0.6 && sectionTop + sectionHeight > scrollTop + viewportHeight * 0.4) {
        $(this).addClass("active").removeClass("inactive"); // フェードイン
      } else {
        $(this).addClass("inactive").removeClass("active"); // フェードアウト
      }
    });
  }

  // スクロールイベントでチェック
  $(window).on("scroll", checkVisibility);

  // 初期チェック
  checkVisibility();
});

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.list img');
    const tooltip = document.querySelector('.tooltip');

    images.forEach(image => {
        image.addEventListener('mouseenter', function(e) {
            tooltip.style.display = 'block';
            tooltip.textContent = e.target.src;
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = e.pageY + 'px';
        });

        image.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX + 20 + 'px';
            tooltip.style.top = e.pageY + 20 + 'px';
        });

        image.addEventListener('mouseleave', function(e) {
            tooltip.style.display = 'none';
        });
    });
});

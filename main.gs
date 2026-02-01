costumes "assets/blank.svg";

# 時計の針を描画するスプライトの初期設定
set_size 10;  # 小さなサイズで針として使用
hide;  # 初期状態では隠す

# 時計の文字盤を描画する手順
proc draw_clock_face {
    # 時計の文字盤を描画
    erase_all;  # 既存の描画をクリア
    pen_down;
    set_pen_color 0x000000;  # 黒色
    set_pen_size 3;

    # 時計の外枠を描画（半径80の円）- 5度ごとのステップで効率化
    goto 0, 0;  # 中心に戻る
    local i = 0;
    repeat 73 {  # 360度を閉じるために73ステップ（0°から360°まで）
        local angle = i * 5;  # 5度ずつ角度を計算
        local x = 80 * cos(angle);
        local y = 80 * sin(angle);
        if i == 0 {
            pen_up;  # 最初の点へは線を引かずに移動
        } else {
            pen_down;  # 2番目以降は線を引く
        }
        goto x, y;
        i = i + 1;
    }
    pen_up;  # 円を描いた後、ペンを上げる

    # 時間の目盛り（12時、3時、6時、9時）を描画
    set_pen_size 5;
    i = 0;
    repeat 12 {
        local h = i;
        local angle = h * 30;  # 12時が上になるように調整（Scratchの座標系では0°=上）
        local outer_x = 70 * cos(angle);
        local outer_y = 70 * sin(angle);
        local inner_x = 60 * cos(angle);
        local inner_y = 60 * sin(angle);

        # 目盛りを描画
        goto inner_x, inner_y;
        pen_down;
        goto outer_x, outer_y;
        pen_up;
        i = i + 1;
    }

    pen_up;
}

# 針を描画する手順
proc draw_hand len,ang,thick {
    # 現在の位置を保存
    local sx = x_position();
    local sy = y_position();

    # ペンの設定
    set_pen_size $thick;
    pen_down;

    # 針の角度に回転
    point_in_direction $ang;

    # 針を描画
    move $len;

    # 中心に戻る
    goto sx, sy;
    pen_up;
}

# 時計を更新するメインループ
onflag {
    # 時計の文字盤を描画
    draw_clock_face;

    forever {
        # 現在の時間を取得
        current_hour = current_hour();
        current_minute = current_minute();
        current_second = current_second();

        # 12時間制に変換
        if current_hour > 12 {
            current_hour = current_hour - 12;
        }
        if current_hour == 0 {
            current_hour = 12;
        }

        # 針の角度を計算
        hour_angle = current_hour * 30 + current_minute * 0.5;
        minute_angle = current_minute * 6;
        second_angle = current_second * 6;

        # 既存の針をクリア（文字盤を再描画）
        draw_clock_face;

        # 秒針を描画（一番上になるように最初に描画）
        goto 0, 0;
        set_pen_color 0xFF0000;
        draw_hand len: 60, ang: second_angle, thick: 1;

        # 分針を描画
        goto 0, 0;
        set_pen_color 0x000000;
        draw_hand len: 55, ang: minute_angle, thick: 3;

        # 時針を描画（一番下になるように最後に描画）
        goto 0, 0;
        set_pen_color 0x000000;
        draw_hand len: 40, ang: hour_angle, thick: 4;
    }
}

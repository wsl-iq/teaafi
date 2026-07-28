package co.median.android

import android.animation.ValueAnimator
import android.view.View
import android.widget.RelativeLayout

object AnimationUtil {

    @JvmStatic
    fun animateHeight(
        view: View,
        params: RelativeLayout.LayoutParams,
        from: Int,
        to: Int,
        duration: Long = 200
    ) {
        ValueAnimator.ofInt(from, to).apply {
            this.duration = duration
            addUpdateListener { animator ->
                val height = animator.animatedValue as Int
                params.height = height
                view.layoutParams = params
            }
            start()
        }
    }
}

import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class ClockController extends GetxController {
  GetStorage box = GetStorage();
  static const String routeName = "/clock";

  Rx<DateTime> dob = DateTime(1995, 8, 17).obs;
  Rx<DateTime> now = DateTime.now().obs;
  Rx<DateTime> diff = DateTime.now().obs;
  RxInt countdownWeeks = 0.obs;
  RxInt countdownDays = 0.obs;
  RxInt countdownHours = 0.obs;
  RxInt countdownMinutes = 0.obs;
  RxInt countdownSeconds = 59.obs;
  RxInt countdownTotalSeconds = (-5).obs;
  countDownTimer() {
    if (countdownTotalSeconds < 0 && countdownTotalSeconds > -4) return;
    countdownTotalSeconds.value--;
    countdownSeconds.value = countdownTotalSeconds.value % 60;
    countdownMinutes.value =
        ((countdownTotalSeconds.value % (60 * 60)) / 60).floor();
    countdownHours.value =
        ((countdownTotalSeconds.value % (60 * 60 * 24)) / (60 * 60)).floor();
    countdownDays.value =
        ((countdownTotalSeconds.value % (60 * 60 * 24 * 7)) / (60 * 60 * 24))
            .floor();
    countdownWeeks.value = ((countdownTotalSeconds.value / 604800)).floor();
  }

  initialCountdown() {
    diff.value = dob.value.add(const Duration(days: 28000));
    countdownTotalSeconds.value = diff.value.difference(now.value).inSeconds;
  }

  @override
  void onReady() {
    initialCountdown();
    super.onReady();
  }
}

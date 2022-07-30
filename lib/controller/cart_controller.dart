import 'package:flutter/material.dart';
import 'package:four_thousand/controller/auth_controller.dart';
import 'package:four_thousand/models/airsoft.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class CartController extends GetxController {
  RxList<Airsoft> cart = <Airsoft>[].obs;

  static const String cartKey = "cart";
  static const String routeName = "/cart";
  GetStorage box = GetStorage();
  RxInt grandTotal = 0.obs;
  Map<String, dynamic> userSession = GetStorage().read(AuthController.authKey);

  // Removing Selected item from the list of cart
  void removeSelectedItemFromCart(int index) {
    cart.removeAt(index);

    List<Map<String, dynamic>> itemsCart =
        cart.map((Airsoft e) => e.toJson()).toList();

    box.write(cartKey, itemsCart);
  }

  // Increasing qty of the selected item
  void increaseQtyOfSelectedItemInCart(int index) {
    cart[index].qty++;
    List<Map<String, dynamic>> itemsCart =
        cart.map((Airsoft e) => e.toJson()).toList();

    box.write(cartKey, itemsCart);
  }

  // Decrease qty of the selected item
  void decreaseQtyOfSelectedItemInCart(int index, Airsoft airsoft) {
    if (airsoft.qty == 1) {
      cart.removeAt(index);
    } else {
      cart[index].qty--;
    }
    List<Map<String, dynamic>> itemsCart =
        cart.map((Airsoft e) => e.toJson()).toList();
    box.write(cartKey, itemsCart);
  }

  // calculate the grand total value
  void calculateGrandTotal() {
    grandTotal.value = 0;
    for (int i = 0; i < cart.length; i++) {
      grandTotal += (cart[i].qty * cart[i].price);
    }
  }

  // listen for updates the list of cart from session
  void updatingSession() {
    box.listenKey(cartKey, (updatedValue) {
      if (updatedValue is List) {
        cart.clear();
        cart.addAll(updatedValue.map((e) => Airsoft.fromMap(e)).toList());
        calculateGrandTotal();
      }
    });
  }

  // updating list of cart with session data
  void getUpdatedSessionCartData() {
    if (box.hasData(cartKey)) {
      List<dynamic> value = GetStorage().read(cartKey);
      if (value is List) {
        cart.clear();
        cart.addAll(value.map((e) => Airsoft.fromMap(e)).toList());
        calculateGrandTotal();
      }
    }
    updatingSession();
  }

  @override
  void onReady() {
    getUpdatedSessionCartData();
    super.onReady();
  }

  // When transaction has been made,
  // clear the session, set grandTotal to zero
  // remove the dialog and show the snackbar
  void transactionCompleted() {
    box.write(cartKey, []).then((value) {
      grandTotal.value = 0;
      cart.clear();
      Get.back();
      Get.snackbar("Message", "Transaction succeed !",
          colorText: Colors.white,
          backgroundColor: const Color(0xff4d4d4d),
          snackPosition: SnackPosition.BOTTOM);
    });
  }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.publicdata;

/**
 * This is the main class for the PublicData project.
 * 
 * Features:
 * - Basic input validation method.
 * - Prints a greeting message.
 * 
 * Author: hoang
 */
public class PublicData {

    public static void main(String[] args) {
        System.out.println("Hello World!");
        
        // Example usage of the isValidData method
        String data = "Sample data";
        if (isValidData(data)) {
            System.out.println("The data is valid.");
        } else {
            System.out.println("Invalid data.");
        }
    }

    
    public static boolean isValidData(String data) {
        return data != null && !data.trim().isEmpty();
    }
}

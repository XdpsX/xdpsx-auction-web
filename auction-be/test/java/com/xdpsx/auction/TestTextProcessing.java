package com.xdpsx.auction;

import org.jsoup.Jsoup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TestTextProcessing {

    public static void main(String[] args) {
        String result = "<p><strong>These sneakers reimagine the instantly recognisable AJ4 for life on the go. We centred comfort and durability while keeping the heritage look you love. Max Air in the heel cushions your every step, and elements of the upper—the wing, eyestay and heel—are blended into a strong, flexible cage that wraps the shoe to add a toughness to your everyday commute.</strong></p>";
        System.out.println(processDescription(result));
    }


    public static String processDescription(String description) {
        // Loại bỏ HTML tag
        String textWithoutHtml = removeHtmlTags(description);
        // Chuyển về chữ thường
        String lowercaseText = textWithoutHtml.toLowerCase();
        // Loại bỏ dấu câu
        String textWithoutPunctuation = removePunctuation(lowercaseText);
        // Loại bỏ stop words
        return removeStopWords(textWithoutPunctuation);
    }

    public static String removeHtmlTags(String input) {
        return Jsoup.parse(input).text();
    }

    private static String removePunctuation(String input) {
//        return input.replaceAll("\\p{Punct}", "");
        return input.replaceAll("[^a-zA-Z\\s]", " ");
    }

    public static String removeStopWords(String input) {
//        List<String> stopWords = Arrays.asList(
//                "a", "an", "the", "and", "or", "but", "if", "then", "while", "of", "on", "in", "to", "with"
//        );

//        List<String> stopWords = Arrays.asList(
//                "a", "an", "the", "and", "or", "but", "if", "then", "while", "of", "on", "in", "to", "with",
//                "for", "at", "by", "from", "as", "that", "this", "it", "is", "was", "be", "are", "not",
//                "have", "has", "had", "do", "does", "did", "their", "they", "them", "his", "her",
//                "she", "he", "we", "you", "your", "its", "my", "our", "such", "more", "most", "some",
//                "any", "no", "all", "both", "each", "few", "many", "much", "other", "another", "same"
//        );

        List<String> stopWords = loadStopWords();

        String[] words = input.split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!stopWords.contains(word.toLowerCase())) {
                result.append(word).append(" ");
            }
        }
        return result.toString().trim();
    }

    public static List<String> loadStopWords() {
        List<String> stopWords = new ArrayList<>();
        // Đường dẫn tới file stopwords.txt trong thư mục gốc
        String filePath = "stopwords.txt"; // Hoặc sử dụng đường dẫn tuyệt đối nếu cần

        try (BufferedReader br = new BufferedReader(new FileReader(new File(filePath)))) {
            String line;
            while ((line = br.readLine()) != null) {
                stopWords.add(line.trim());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return stopWords;
    }
}

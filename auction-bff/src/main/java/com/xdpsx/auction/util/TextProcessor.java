package com.xdpsx.auction.util;

import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class TextProcessor {
    private static final Logger logger = LoggerFactory.getLogger(TextProcessor.class);

    public static String processDescription(String description) {

        String textWithoutHtml = removeHtmlTags(description);

        return processName(textWithoutHtml);
    }

    public static String processName(String name){
        String lowercaseText = name.toLowerCase();
        String textWithoutPunctuation = removePunctuation(lowercaseText);
        return removeStopWords(textWithoutPunctuation);
    }

    private static String removeHtmlTags(String input) {
        return Jsoup.parse(input).text();
    }

    private static String removePunctuation(String input) {
//        return input.replaceAll("\\p{Punct}", "");
//        return input.replaceAll("[^a-zA-Z\\s]", " ");
        return input.replaceAll("[^a-zA-Z0-9]", " ");
    }

    private static String removeStopWords(String input) {
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

    private static List<String> loadStopWords() {
        List<String> stopWords = new ArrayList<>();
        String filePath = "stopwords.txt";

        try (BufferedReader br = new BufferedReader(new FileReader(new File(filePath)))) {
            String line;
            while ((line = br.readLine()) != null) {
                stopWords.add(line.trim());
            }
        } catch (IOException e) {
            logger.error("Error:", e);
        }

        return stopWords;
    }
}

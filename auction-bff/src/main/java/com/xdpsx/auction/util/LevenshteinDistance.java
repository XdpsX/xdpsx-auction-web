package com.xdpsx.auction.util;

import java.util.Arrays;

public class LevenshteinDistance {
    public static int calLevenshteinDistance(String str1, String str2) {
        int[][] dp = new int[str1.length() + 1][str2.length() + 1];
        for (int[] row : dp) {
            Arrays.fill(row, -1);
        }
        return levenshteinDistance(str1, str2, str1.length(), str2.length(), dp);
    }
    public static int levenshteinDistance(String str1, String str2, int m, int n, int[][] dp) {
        if (m == 0) {
            return n;
        }
        if (n == 0) {
            return m;
        }
        if (dp[m][n] != -1) {
            return dp[m][n];
        }
        if (str1.charAt(m - 1) == str2.charAt(n - 1)) {
            dp[m][n] = levenshteinDistance(str1, str2, m - 1, n - 1, dp);
        } else {
            dp[m][n] = 1 + Math.min(
                    levenshteinDistance(str1, str2, m, n - 1, dp),
                    Math.min(
                            levenshteinDistance(str1, str2, m - 1, n, dp),
                            levenshteinDistance(str1, str2, m - 1, n - 1, dp)
                    )
            );
        }
        return dp[m][n];
    }
}

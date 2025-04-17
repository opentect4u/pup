<?php
use Smalot\PdfParser\Parser;

function validate_pdf_content_buffer($tmp_file_path)
{
    try {
        $parser = new \Smalot\PdfParser\Parser();
        $pdf = $parser->parseFile($tmp_file_path); // Read directly from temp file
        $text = $pdf->getText();

        // Basic checks
        if (preg_match('/<script.*?>.*?<\/script>/is', $text) || preg_match('/<[^>]+>/', $text)) {
            return 0;
        }

        return 1;
    } catch (Exception $e) {
        return 0;
    }
}


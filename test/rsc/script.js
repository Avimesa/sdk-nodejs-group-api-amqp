/*
 * COPYRIGHT: This file and the source codes contained herein ("document") are
 * the property of Avimesa, Inc.
 *
 * Copyright 2016-2018, Avimesa, Inc. All rights reserved.
 * LICENSE: This document may only be used under the terms of the
 * license described at http://avimesa.com/developer-license.txt
 */

/**@brief Entry point for Device Driver Script
 *
 * @returns none
 */
function avmsaMain(){

	// Send the 'dev_in' data to the raw queue
	avmsaSendToRawQueue();

	// Get the next actuation messsge (if any) and relay to device
	dev_out.actuation = avmsaGetNextActuationMsg();
}


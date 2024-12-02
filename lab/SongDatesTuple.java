package edu.cs.cs4650.mapreduce;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.hadoop.io.Writable;

public class SongDatesTuple implements Writable {
	
	private Date first = new Date();
	public Date getFirst() {
		return first;
	}

	public void setFirst(Date first) {
		this.first = first;
	}

	public Date getLast() {
		return last;
	}

	public void setLast(Date last) {
		this.last = last;
	}

	private Date last = new Date();
	
	private static final SimpleDateFormat format =
			new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
	@Override
	public void readFields(DataInput in) throws IOException {
		first = new Date(in.readLong());
		last = new Date(in.readLong());
	}

	@Override
	public void write(DataOutput out) throws IOException {
		out.writeLong(first.getTime());
		out.writeLong(last.getTime());
	}

	@Override
	public String toString() {
		return "First play: "+ format.format(first) + "\t" + "Last play:" + format.format(last);
	}

}

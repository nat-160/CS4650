package edu.cs.cs4650.mapreduce;

import java.util.*;
import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class MinTemp {

	public static class MinTempMapper extends Mapper<Object, Text, Text, IntWritable> {
		@Override
		public void map(Object key, Text value, Context context)
				throws IOException, InterruptedException {
			String row = value.toString();
			String[] rowValues = row.split(",");
            if(rowValues[0].equals("date")) return;
			String date = rowValues[0];
            int minTemp = Integer.parseInt(rowValues[2]).intValue();
            context.write(new Text(date), new IntWritable(minTemp));
		}

	}
	
	public static class MinTempReducer extends Reducer<Text, IntWritable, Text, IntWritable> {

		@Override
		public void reduce(Text key, Iterable<IntWritable> values, Context context)
				throws IOException, InterruptedException {
			for(IntWritable value : values) {
				if (value.compareTo(new IntWritable(68))>68){
                    context.write(key, value);
                }
			}
		}
		
	}

	@SuppressWarnings("deprecation")
	public static void main(String[] args)
			throws IOException, ClassNotFoundException, InterruptedException {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf,"min temp");
		job.setJarByClass(MinTemp.class);
		job.setMapperClass(MinTempMapper.class);
		job.setCombinerClass(MinTempReducer.class);
		job.setReducerClass(MinTempReducer.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		
		System.exit(job.waitForCompletion(true) ? 0 : 1);
	}

}

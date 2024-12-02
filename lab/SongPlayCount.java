/**
 * 
 */
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

/**
 * @author apoloimagod
 *
 */
public class SongPlayCount {

	public static class SongCountMapper extends Mapper<Object, Text, Text, IntWritable> {

		@Override
		public void map(Object key, Text value, Context context)
				throws IOException, InterruptedException {
			String row = value.toString();
			String[] rowValues = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
			
			if (rowValues[0].compareTo("SONG RAW") != 0) {
				String songName = rowValues[1];

				context.write(new Text(songName), new IntWritable(1));
			}
		}

	}
	
	public static class SongCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {

		@Override
		public void reduce(Text key, Iterable<IntWritable> values, Context context)
				throws IOException, InterruptedException {
			int sum = 0;
			
			for(IntWritable value : values) {
				sum += value.get();
			}
			
			context.write(key, new IntWritable(sum));
		}
		
	}

	/**
	 * @param args
	 * @throws IOException 
	 * @throws InterruptedException 
	 * @throws ClassNotFoundException 
	 */
	@SuppressWarnings("deprecation")
	public static void main(String[] args)
			throws IOException, ClassNotFoundException, InterruptedException {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf,"song count");
		job.setJarByClass(SongPlayCount.class);
		job.setMapperClass(SongCountMapper.class);
		job.setCombinerClass(SongCountReducer.class);
		job.setReducerClass(SongCountReducer.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		
		System.exit(job.waitForCompletion(true) ? 0 : 1);
	}

}
